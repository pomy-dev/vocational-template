-- Run after schema.sql in the Supabase SQL editor (or through the Supabase CLI).
-- This RPC keeps public registration atomic: no partial student records if an
-- enrollment or payment record fails.
create sequence if not exists public.student_number_sequence start with 1;

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
  p_guardian_phone text default null
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
begin
  if coalesce(trim(p_full_name), '') = '' or coalesce(trim(p_email), '') = '' then
    raise exception 'Full name and email are required.' using errcode = '22023';
  end if;

  select id into v_course_id from courses where name = p_course_name and is_published = true limit 1;
  if v_course_id is null then
    raise exception 'The selected programme is unavailable. Please choose another programme.' using errcode = '22023';
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

  insert into enrollments (student_id, course_id, examination_period, category, level, status)
  values (v_student_id, v_course_id, nullif(trim(p_examination_period), ''), nullif(trim(p_category), ''), nullif(trim(p_level), ''), 'pending')
  returning id into v_enrollment_id;

  insert into payments (student_id, enrollment_id, label, amount, status, reference, refundable, notes)
  values (v_student_id, v_enrollment_id, 'Registration fee', 500.00, 'pending', v_student_number, false,
    concat_ws(' · ', nullif(trim(p_field), ''), nullif(trim(p_guardian_relationship), '')));

  return query select v_student_id, v_student_number, v_enrollment_id;
end;
$$;

revoke all on function public.register_student_application(text, text, text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.register_student_application(text, text, text, text, text, text, text, text, text, text, text, text) to anon, authenticated;
