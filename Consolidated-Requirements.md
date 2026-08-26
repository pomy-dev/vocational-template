# National Skills & Technical College Learner Management Ecosystem

## 1. Consolidated objective

Build a cohesive prototype ecosystem for National Skills & Technical College (NSTC), a South African technical and vocational college. The ecosystem combines a premium public marketing website, a student learning portal, an admin/lecturer management portal, and read-only parent access. The public website must connect directly to the registration and enrollment flow through a prominent **Apply Now** action.

The prototype is client-side only. It uses rich seeded dummy data and `localStorage` for persistence, while exposing clean data models and a complete PostgreSQL-compatible `schema.sql` for a future Supabase migration. No real payment processing, authentication backend, file storage, or Supabase connection is required at this stage.

## 2. Source comparison and resolution

| Area | Project Outline | Pasted Requirements | Consolidated decision |
|---|---|---|---|
| Product scope | Website, learning portal, management system, parent accessibility | Same four areas with explicit routes and screens | Implement all four areas as a connected multi-page prototype. |
| Technology | Next.js, `.tsx`, Tailwind CSS | Next.js App Router, TypeScript, Tailwind, client-only | Preserve the strict Next.js/App Router/TypeScript/Tailwind direction in the selected project. |
| Persistence | Dummy data and local storage | LocalStorage for all entities and seeded data | Seed on first load; persist students, enrollments, assignments, attendance, payments, announcements, graduate requests, and related records locally. |
| Public website | Institutional content, offerings, pricing, graduates, map, team, contact | Exact section order, interactions, theme, and route `/` | Build the complete ordered landing page with premium gold/black styling and interactive course flips, counters, horizontal team carousel, graduate request form, contact form, and campus map embeds. |
| Student portal | Registration, course selection, resources, assignments, scores, attendance, tutor contact, statements | Explicit `/portal` or `/student` flow and enrollment wizard | Implement registration → enrollment wizard → student dashboard, with demo payment choice and generated unique student number. |
| Management | Lecturer/admin data management, attendance, announcements, schedules, transcripts, finances | Explicit `/admin` role distinction and CRUD list | Implement an admin/lecturer portal with dashboard metrics, learner profile views, CRUD for schedules/assignments/exams/announcements/courses, attendance, payments, statements, and transcript generation. |
| Parent access | Login using student email and ID/number, progress view, statement | Explicit `/parent`, read-only fields | Implement a demo parent lookup/login that validates student email plus student number/ID and exposes read-only progress information. |
| Design | Public gold/black; system black/white | Exact palette, responsive premium design, transitions | Use gold `#D4AF37`/`#C9A227` and black `#0A0A0A`/`#111111` publicly; black/white portals with restrained gold accents. |
| Academic catalog | Detailed brochure offerings and prices | Requires all major offerings and exact fee/duration coverage | Include brochure-backed catalog data for Engineering N1–N6, Business/Management N4–N6, IT, Mine & Construction Machines, Artisan/Trade Testing, GCC, Health & Safety, Matric Rewrite, QCTO/SETA programs, short courses, welding, machine licenses, and artisan prep. |
| Operational UX | Spinner and confirmation modal clues | Global spinner on every action; confirmation for destructive/important actions | Create reusable loading and confirmation components and use them for submits, deletes, enrollments, payments, and other async-looking actions. |
| Migration | Prepare `schema.sql` | Complete PostgreSQL schema mirroring frontend entities | Provide a comprehensive schema covering users/roles, students, parents, campuses, courses, subjects, enrollments, schedules, assignments, submissions, exams, results, attendance, payments, announcements, graduate requests, resources, and related entities. |

## 3. Public website (`/`)

The page must be a polished institutional marketing experience with these sections in order: sticky navigation and logo; gold **Apply Now** button; hero with the mottos “We Teach Skills to Change Lives!” and “Your Future, Is Our Concern”; About Us and mission; animated institutional statistics; courses and certificates with popular badges and hover-flip cards showing subjects and duration; short courses, individual programs, and subjects; skills, vocational, and artisan showcase; artisan/skills graduate directory with category filters and a **Request Graduate** form persisted to localStorage; pricing and fee breakdown; gallery; news and updates; horizontally scrollable team cards with controls; Google Maps campus embeds; testimonials; Why Choose Us; contact form; banking details, registration requirements, campus addresses, accreditation codes; and a credential-rich footer.

Institutional details include DHET code `2019FE07/016`, QCTO examination centre `08-QCTO/SDP060523062704`, trade test centre `08-QCTO/AC-TTC080223185714 / SETA / ICB`, more than 25,500 learners in the job market/mines/municipalities, more than 1,000 active students, free Wi-Fi, extra classes, pageants, and a stated 100% employment and mentorship guarantee. Registration and practical fees are each R500. Banking details are FNB business account `62611136632`, branch `250655`, with ID/passport as payment reference.

Campuses are Wynberg Johannesburg at Prosperitus Building, Old Pretoria Road, next to Home Affairs, and Middelburg at OR Tambo Street, in the same building as the Police Detectives.

## 4. Learning/student portal (`/portal` or `/student`)

The public Apply Now flow must lead into a registration form collecting personal details and dummy document uploads, followed by a demo registration-fee payment step with refundable/non-refundable choice. Enrollment then collects field of study, level, program, examination period (including Trimester 1 and Trimester 2), category, and a multi-select list of subjects/programs. On completion it generates a unique student number and creates a local student/enrollment record.

The student dashboard must provide My Courses for online and on-campus studies; learning resources with download actions; assignments with download and submission state; class, assignment, and exam schedules; attendance reflection; term-based assignment and exam scores/results; tutor WhatsApp/email actions; statement of results/transcript download; and financial overview with payment history.

## 5. Management portal (`/admin`)

The management portal must distinguish Admin and Lecturer capabilities in the UI. The dashboard shows total students, active, suspended, completed, alumni, recently high-absentee students based on the latest two weeks, and owing students. Staff can inspect learner profiles containing study start date, selected courses/subjects, attendance rate, assignments and scores, status, and financial details.

Admin/lecturer workflows include creating, publishing, editing, and deleting class schedules, assignments, exams, and announcements; recording attendance; updating payments; printing/downloading statements; generating transcripts; and managing the local catalog of courses, subjects, fees, and related records. Destructive and consequential actions require confirmation.

## 6. Parent portal (`/parent`)

Parents use a demo login/lookup with the student’s email and student number or ID. The read-only view includes demographics, courses and duration, aggregated scores, assignments and scores, activities, status, lecturer remarks and contacts, and statement-of-results download.

## 7. Seed data requirements

On first load, seed realistic South African dummy records across multiple campuses, course categories, short courses, machine licenses, welding courses, artisan preparation, students at active/suspended/completed/alumni statuses, attendance over at least two weeks, term results, assignments, payments, announcements, resources, tutors, testimonials, team members, gallery items, and graduate profiles.

Exact brochure pricing must be represented for short courses, including two-month programs such as A+ PC Technician (R2,500 registration, R3,000 monthly, R8,500 total), N+ Networking (R2,500, R2,500, R7,500), Chef (R3,000, R3,000, R9,000), Nails Technician (R2,500, R2,000, R6,500), and First Aid/Fire (five days, R2,800 total). Include all listed machine-training prices, welding prices, and four-week artisan/trade-test preparation fees.

## 8. Technical and quality acceptance criteria

The application must be responsive and mobile-first, use reusable components, provide smooth transitions and hover states, show a loading spinner on every user action that appears asynchronous, and use custom confirmation modals where appropriate. All prototype data must work without a backend and survive page refresh through localStorage. The source must include a clean future-migration `schema.sql`. The public website and authenticated-style portals must feel like one cohesive ecosystem, and all primary navigation paths must be demonstrable with dummy data.

## 9. Scope boundary

Real authentication, production authorization, payment gateways, actual document uploads, WhatsApp/email delivery, live Google Maps API credentials, server-side persistence, and Supabase integration are explicitly deferred. These should be represented by safe demo interactions or links/placeholders, without implying production security or payment completion.
