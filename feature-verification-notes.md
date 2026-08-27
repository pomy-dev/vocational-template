# Feature verification notes

The latest remote UI was preserved and the requested features were reapplied on top of it. The local preview at `http://localhost:4174/` renders the premium NSTC public landing page with the new apprenticeship section titled “Your next opportunity starts here,” three open opportunities, CV application buttons, a suggestion box, and footer links for Apprenticeships and Suggestion box.

After clearing the prior demo session, direct navigation to `/portal` correctly renders the protected student login screen with email, student number, password, forgot-password action, and family / next-of-kin access.

Password recovery verification succeeded: Forgot password opens the recovery form, valid seeded identifiers advance to “Set a new password,” and the reset form exposes a new-password field and save action.

Family access verification succeeded with student email, student number, and registered phone. The read-only learner profile loaded with academic results, attendance, learner demographics, statement action, and sign-out.

The dedicated `/apprenticeships` route renders a placement header, three open opportunity posts, and public navigation. Opening an opportunity displays a CV application modal with full name, email, phone, CV upload, and submission action.
