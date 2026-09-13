-- National Skills & Technical College learner management ecosystem
-- PostgreSQL-compatible prototype schema for future Supabase migration.

create extension if not exists "pgcrypto";

create type user_role as enum ('admin', 'lecturer', 'student', 'parent');
create type learner_status as enum ('active', 'suspended', 'completed', 'alumni');
create type delivery_mode as enum ('online', 'on_campus', 'hybrid');
create type enrollment_status as enum ('pending', 'active', 'completed', 'withdrawn');
create type assessment_kind as enum ('assignment', 'exam');
create type payment_status as enum ('pending', 'paid', 'refunded', 'failed');
create type level as enum ('N1','N2','N3','N4','N5','N6','Certificate','Diploma','Occupational','Skills');

create table campuses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  province text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  phone text,
  created_at timestamptz not null default now()
);

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

create table academic_fields (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
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

create table staff_assignments (
  id uuid primary key default gen_random_uuid(),
  lecturer_id uuid not null references users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  campus_id uuid references campuses(id) on delete set null,
  created_at timestamptz not null default now()
);

create table schedules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  campus_id uuid references campuses(id) on delete set null,
  created_by uuid references users(id) on delete set null,
  title text not null,
  kind text not null default 'class',
  schedule_date date not null,
  start_time time,
  end_time time,
  location text,
  notes text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table learning_resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  title text not null,
  file_url text,
  file_type text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table assessments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  created_by uuid references users(id) on delete set null,
  title text not null,
  kind assessment_kind not null,
  term text,
  due_at timestamptz,
  total_marks numeric(8,2),
  instructions text,
  file_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  submitted_at timestamptz,
  file_url text,
  status text not null default 'not_started',
  feedback text,
  unique (assessment_id, student_id)
);

create table results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  marks numeric(8,2),
  percentage numeric(5,2),
  grade text,
  lecturer_comment text,
  published_at timestamptz,
  unique (assessment_id, student_id)
);

create table attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid references schedules(id) on delete cascade,
  session_date date not null,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references attendance_sessions(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  present boolean not null default false,
  note text,
  unique (session_id, student_id)
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

create table announcements (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references users(id) on delete set null,
  title text not null,
  body text not null,
  audience text not null default 'all_students',
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table graduate_profiles (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete set null,
  skill_category text not null,
  skill_name text not null,
  location text,
  apprenticeship_completed_at date,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table graduate_requests (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null,
  requester_email text not null,
  organisation text,
  skill_category text not null,
  quantity integer not null default 1 check (quantity > 0),
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  interest text,
  message text not null,
  created_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  quote text not null,
  is_published boolean not null default true
);

create index students_status_idx on students(status);
create index students_campus_idx on students(campus_id);
create index enrollments_student_idx on enrollments(student_id);
create index schedules_date_idx on schedules(schedule_date);
create index payments_student_idx on payments(student_id);
create index assessments_course_idx on assessments(course_id);
create index attendance_session_date_idx on attendance_sessions(session_date);
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

create table suggestions (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid references users(id) on delete set null,
  name text,
  email text,
  category text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table support_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete set null,
  subject text not null,
  category text not null,
  message text not null,
  status text not null default 'open',
  staff_response text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table apprenticeship_opportunities (
  id uuid primary key default gen_random_uuid(),
  employer text not null,
  title text not null,
  opportunity_type text not null,
  location text,
  description text,
  closing_date date,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table apprenticeship_applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references apprenticeship_opportunities(id) on delete cascade,
  applicant_id uuid references users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  cv_file_url text,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

-- Lecturer workspace support: evidence files, transcript remarks and notification read state.
create table if not exists support_request_attachments (
  id uuid primary key default gen_random_uuid(),
  support_request_id uuid not null references support_requests(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  mime_type text,
  created_at timestamptz not null default now()
);

create table if not exists transcript_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  lecturer_id uuid references users(id) on delete set null,
  remarks text not null,
  generated_at timestamptz not null default now()
);

create table if not exists announcement_reads (
  announcement_id uuid not null references announcements(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (announcement_id, user_id)
);

create index if not exists support_attachment_request_idx on support_request_attachments(support_request_id);
create index if not exists transcript_student_idx on transcript_requests(student_id);
create index if not exists announcement_reads_user_idx on announcement_reads(user_id);
-- Public catalogue, sales orders and application payment evidence.
create table if not exists occupational_programmes (
  id uuid primary key default gen_random_uuid(),
  college_name text not null,
  accrediting_body text not null,
  programme_name text not null,
  programme_type text not null,
  is_published boolean not null default true
);

create table if not exists accreditation_bodies (
  code text primary key,
  name text not null,
  logo_url text
);

create table if not exists application_payment_receipts (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references apprenticeship_applications(id) on delete set null,
  file_url text not null,
  file_name text not null,
  mime_type text,
  created_at timestamptz not null default now()
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

create table if not exists sales_orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  item text not null,
  quantity integer not null default 1,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists occupational_college_idx on occupational_programmes(college_name);
create index if not exists payment_receipt_application_idx on application_payment_receipts(application_id);
create index if not exists registration_documents_student_idx on registration_documents(student_id);
create index if not exists registration_documents_trace_idx on registration_documents(application_trace_id);
