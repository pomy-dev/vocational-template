# Verification notes

- `npm run check` passed after removing the obsolete `ignoreDeprecations` compiler option and adding the missing `ArrowUpRight` icon import.
- `npm run build` passed with Vite production output and no CSS warnings after correcting the escaped responsive selector.
- Public route `/` loaded successfully in Chromium with the NSTC gold-and-black hero, navigation, Apply Now CTA, stats, programme cards, graduate showcase, pricing, gallery, team, map/contact, and footer content visible in page extraction.
- Clicking the public Apply Now CTA navigated to `/portal/apply` and rendered the three-step registration wizard with personal details, document upload placeholder, progress indicator, and Continue action.

- Student route `/portal` loaded successfully with the black-and-white portal shell, learner metrics, pathway progress, class schedule, assignment list, tutor contact links, and responsive sidebar.
- Management route `/admin` loaded successfully with seeded counts (5 total learners, 2 active, 2 owing, 1 alumni), recent student register, absenteeism flag for a low-attendance learner, announcements, and finance summary.

- Parent route `/parent` loaded with a family-access login form. The seeded demo credentials were accepted, and the read-only profile rendered Thabo Mokoena’s status, attendance, average score, course duration, demographics, tutor, lecturer remark, subject results, assignments, and statement-of-results action.

- After reopening `/portal/apply`, the wizard advanced to Step 2 and displayed field of study, level, programme, examination period (Trimester 1–3), and selectable subject modules as required.

- Management route `/admin/academics` rendered the Schedules, Assignments, Exams, and Announcements tabs with seeded records. The Create Schedule action opened a functional modal containing title, date, notes, and Save and publish controls.
