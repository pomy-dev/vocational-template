-- Run after schema.sql in the Supabase SQL editor (or through the Supabase CLI).
-- This RPC keeps public registration atomic: no partial student records if an
-- enrollment or payment record fails.
create sequence if not exists public.student_number_sequence start with 1;

alter table if exists public.subjects
  add column if not exists available_levels text[] not null default '{}';

alter table if exists public.enrollment_subjects
  add column if not exists selected_level text;

update public.enrollment_subjects enrollment_subject
set selected_level = coalesce(subject.available_levels[1], 'N1')
from public.subjects subject
where enrollment_subject.subject_id = subject.id
  and enrollment_subject.selected_level is null;

alter table if exists public.enrollment_subjects
  alter column selected_level set not null;

create unique index if not exists subjects_course_name_uidx
  on public.subjects(course_id, name);

create index if not exists enrollment_subjects_subject_idx
  on public.enrollment_subjects(subject_id);

insert into storage.buckets (id, name, public)
values ('registration-documents', 'registration-documents', false)
on conflict (id) do nothing;

drop policy if exists registration_documents_upload on storage.objects;
create policy registration_documents_upload
on storage.objects for insert to anon, authenticated
with check (bucket_id = 'registration-documents' and name like 'applications/%');

drop policy if exists registration_documents_cleanup on storage.objects;
create policy registration_documents_cleanup
on storage.objects for delete to anon, authenticated
using (bucket_id = 'registration-documents' and name like 'applications/%');

drop function if exists public.register_student_application(text, text, text, text, text, text, text, text, text, text, text, text, uuid, jsonb, jsonb, jsonb);

create or replace function public.register_student_application(
  p_full_name text,
  p_email text,
  p_phone text,
  p_course_name text,
  p_category text,
  p_field text,
  p_level text,
  p_examination_period text,
  p_guardian_name text default null,
  p_guardian_relationship text default null,
  p_guardian_email text default null,
  p_guardian_phone text default null,
  p_application_trace_id uuid default null,
  p_photo jsonb default null,
  p_receipt jsonb default null,
  p_subjects jsonb default '[]'::jsonb,
  p_programmes jsonb default '[]'::jsonb
)
returns table (student_id uuid, student_number text, enrollment_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_parent_id uuid;
  v_student_id uuid;
  v_course_id uuid;
  v_enrollment_id uuid;
  v_student_number text;
  v_first_enrollment_id uuid;
  v_programme jsonb;
  v_programmes jsonb;
  v_subject jsonb;
  v_subject_id uuid;
begin
  if coalesce(trim(p_full_name), '') = '' or coalesce(trim(p_email), '') = '' then
    raise exception 'Full name and email are required.' using errcode = '22023';
  end if;

  insert into users (email, full_name, phone, role)
  values (lower(trim(p_email)), trim(p_full_name), nullif(trim(p_phone), ''), 'student')
  returning id into v_user_id;

  if nullif(trim(p_guardian_name), '') is not null then
    insert into parents (full_name, email, phone)
    values (trim(p_guardian_name), nullif(lower(trim(p_guardian_email)), ''), nullif(trim(p_guardian_phone), ''))
    returning id into v_parent_id;
  end if;

  v_student_number := format('NSTC-%s-%s', to_char(current_date, 'YY'), lpad(nextval('student_number_sequence')::text, 6, '0'));
  insert into students (user_id, parent_id, student_number, full_name, email, phone, guardian_name, status, study_start_date)
  values (v_user_id, v_parent_id, v_student_number, trim(p_full_name), lower(trim(p_email)), nullif(trim(p_phone), ''), nullif(trim(p_guardian_name), ''), 'active', current_date)
  returning id into v_student_id;

  if jsonb_typeof(coalesce(p_programmes, '[]'::jsonb)) <> 'array' then
    raise exception 'Programmes must be an array.' using errcode = '22023';
  end if;

  v_programmes := coalesce(p_programmes, '[]'::jsonb);
  if jsonb_array_length(v_programmes) = 0 then
    v_programmes := jsonb_build_array(jsonb_build_object(
      'course', p_course_name,
      'category', p_category,
      'field', p_field,
      'level', p_level,
      'period', p_examination_period,
      'subjects', coalesce(p_subjects, '[]'::jsonb)
    ));
  end if;

  for v_programme in select value from jsonb_array_elements(v_programmes) loop
    select id into v_course_id
    from courses
    where name = nullif(trim(v_programme->>'course'), '') and is_published = true
    limit 1;
    if v_course_id is null then
      raise exception 'One of the selected programmes is unavailable. Please choose another programme.' using errcode = '22023';
    end if;

    insert into enrollments (student_id, course_id, examination_period, category, level, status)
    values (v_student_id, v_course_id, nullif(trim(v_programme->>'period'), ''), nullif(trim(v_programme->>'category'), ''), nullif(trim(v_programme->>'level'), ''), 'pending')
    returning id into v_enrollment_id;
    v_first_enrollment_id := coalesce(v_first_enrollment_id, v_enrollment_id);

    if jsonb_typeof(coalesce(v_programme->'subjects', '[]'::jsonb)) <> 'array' then
      raise exception 'Selected subjects must be an array.' using errcode = '22023';
    end if;
    if exists (select 1 from subjects where course_id = v_course_id)
       and jsonb_array_length(coalesce(v_programme->'subjects', '[]'::jsonb)) = 0 then
      raise exception 'Select at least one subject for each programme.' using errcode = '22023';
    end if;

    for v_subject in select value from jsonb_array_elements(coalesce(v_programme->'subjects', '[]'::jsonb)) loop
      select id into v_subject_id
      from subjects
      where course_id = v_course_id
        and name = nullif(trim(v_subject->>'name'), '')
        and (v_subject->>'level') = any(available_levels)
      limit 1;
      if v_subject_id is null then
        raise exception 'One or more selected subjects or levels are not available for this programme.' using errcode = '22023';
      end if;
      insert into enrollment_subjects (enrollment_id, subject_id, selected_level)
      values (v_enrollment_id, v_subject_id, trim(v_subject->>'level'));
      v_subject_id := null;
    end loop;

    insert into payments (student_id, enrollment_id, label, amount, status, reference, refundable, notes)
    values (v_student_id, v_enrollment_id, 'Registration fee', 500.00, 'pending', v_student_number, false,
      concat_ws(' · ', nullif(trim(v_programme->>'field'), ''), nullif(trim(p_guardian_relationship), '')));
  end loop;

  if p_application_trace_id is not null then
    insert into registration_documents (application_trace_id, student_id, enrollment_id, document_type, storage_path, file_url, file_name, mime_type)
    select p_application_trace_id, v_student_id, v_first_enrollment_id, item.document_type,
      item.document_data->>'path', item.document_data->>'url', item.document_data->>'name', item.document_data->>'mimeType'
    from (values
      ('photo'::text, p_photo),
      ('receipt'::text, p_receipt)
    ) as item(document_type, document_data)
    where item.document_data is not null
      and coalesce(item.document_data->>'path', '') <> ''
      and coalesce(item.document_data->>'url', '') <> ''
      and coalesce(item.document_data->>'name', '') <> ''
      and coalesce(item.document_data->>'mimeType', '') <> '';
  end if;

  return query select v_student_id, v_student_number, v_first_enrollment_id;
end;
$$;

revoke all on function public.register_student_application(text, text, text, text, text, text, text, text, text, text, text, text, uuid, jsonb, jsonb, jsonb) from public;
grant execute on function public.register_student_application(text, text, text, text, text, text, text, text, text, text, text, text, uuid, jsonb, jsonb, jsonb) to anon, authenticated;
