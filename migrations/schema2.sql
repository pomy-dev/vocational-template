-- National Skills & Technical College learner management ecosystem
-- PostgreSQL-compatible prototype schema for future Supabase migration.

create extension if not exists "pgcrypto";

create type user_role as enum ('admin', 'lecturer', 'student', 'parent');
create type learner_status as enum ('active', 'suspended', 'completed', 'alumni');
create type enrollment_status as enum ('pending', 'active', 'completed', 'withdrawn');
create type payment_status as enum ('pending', 'paid', 'refunded', 'failed');
create type level as enum ('N1','N2','N3','N4','N5','N6','Certificate','Diploma','Occupational','Skills');

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  phone text,
  role user_role not null,
  external_auth_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table parents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

create table students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references users(id) on delete set null,
  parent_id uuid references parents(id) on delete set null,
  campus_id uuid references campuses(id) on delete set null,
  student_number text not null unique,
  identity_number text,
  full_name text not null,
  email text not null,
  phone text,
  date_of_birth date,
  address text,
  guardian_name text,
  status learner_status not null default 'active',
  study_start_date date,
  lecturer_remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table courses (
  id uuid primary key default gen_random_uuid(),
  field_id uuid references academic_fields(id) on delete set null,
  name text not null,
  category text not null,
  level text,
  duration text,
  delivery_mode delivery_mode not null default 'on_campus',
  registration_fee numeric(12,2) not null default 500,
  practical_fee numeric(12,2) not null default 0,
  monthly_fee numeric(12,2),
  total_fee numeric(12,2),
  popular boolean not null default false,
  description text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table subjects (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  name text not null,
  code text,
  credits integer,
  available_levels text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (course_id, name),
  check (array_position(available_levels, '') is null)
);

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete restrict,
  examination_period text,
  category text,
  level text,
  status enrollment_status not null default 'pending',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (student_id, course_id, examination_period)
);

create table enrollment_subjects (
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  subject_id uuid not null references subjects(id) on delete restrict,
  selected_level text not null,
  primary key (enrollment_id, subject_id),
  check (length(trim(selected_level)) > 0)
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  enrollment_id uuid references enrollments(id) on delete set null,
  recorded_by uuid references users(id) on delete set null,
  label text not null,
  amount numeric(12,2) not null,
  payment_date date not null default current_date,
  status payment_status not null default 'paid',
  reference text,
  refundable boolean,
  notes text,
  created_at timestamptz not null default now()
);

create index students_status_idx on students(status);
create index enrollments_student_idx on enrollments(student_id);
create index payments_student_idx on payments(student_id);
create index enrollment_subjects_subject_idx on enrollment_subjects(subject_id);

-- Helpful read-only dashboard view for the future management portal.
create view student_dashboard_summary as
select
  s.id,
  s.student_number,
  s.full_name,
  s.email,
  s.status,
  s.study_start_date,
  c.name as campus_name,
  coalesce(sum(p.amount) filter (where p.status = 'paid'), 0) as paid_amount,
  coalesce(sum(p.amount) filter (where p.status = 'pending'), 0) as pending_amount,
  count(distinct e.id) as enrollment_count
from students s
left join campuses c on c.id = s.campus_id
left join payments p on p.student_id = s.id
left join enrollments e on e.student_id = s.id
group by s.id, c.name;


create table next_of_kin (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  full_name text not null,
  relationship text not null,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists registration_documents (
  id uuid primary key default gen_random_uuid(),
  application_trace_id uuid not null,
  student_id uuid not null references students(id) on delete cascade,
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  document_type text not null check (document_type in ('photo', 'receipt')),
  storage_path text not null unique,
  file_url text not null,
  file_name text not null,
  mime_type text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (application_trace_id, document_type)
);

create index if not exists registration_documents_student_idx on registration_documents(student_id);
create index if not exists registration_documents_trace_idx on registration_documents(application_trace_id);
