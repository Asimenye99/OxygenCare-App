# Concept 2: Mobile Application Product Specification

## OxygenCare mobile-first experience

**Audience:** Vibe-coding AI / product designer / developer\
**Initial release:** responsive PWA; native apps may come later

## 1. Product objective

Build a mobile-first application that lets hospitals register oxygen
concentrators and request maintenance, lets verified biomedical
engineers manage their profiles and assigned jobs, and lets
administrators coordinate verification and service delivery. The
architecture should permit a future freelance marketplace, but general
job marketplace functions are not part of the first healthcare MVP.

## 2. App entry and navigation

### Welcome screen

-   Logo and name: OxygenCare Malawi (working name).
-   Short statement: "Reliable maintenance for oxygen equipment."
-   Primary buttons: "Sign in" and "Create account".
-   Account type choices on registration:
    1.  Hospital / Facility
    2.  Biomedical Engineer / Technician
    3.  Admin is not a public self-registration option. Admin accounts
        must be invited or provisioned securely.
-   Links: About, How it works, Contact/support, Privacy, Terms.
-   State clearly that this is a maintenance coordination platform, not
    an emergency oxygen supply service.

### Authentication

-   Sign up using name, email and phone; password or supported
    passwordless authentication.
-   Email/phone verification when provider is configured.
-   Sign in, sign out, forgot password, reset password.
-   Clear loading, validation, success and error states.
-   Prevent duplicate accounts where feasible.
-   Users cannot self-select or self-grant admin privileges.
-   A user may belong to more than one hospital only if explicitly
    invited and authorised.
-   Role changes require admin review and audit logging.

## 3. Hospital mobile experience

### Hospital registration

Fields: - Facility name (required) - Facility type: central/referral,
district, community/rural hospital, health centre, private,
mission/faith-based, other - Ownership: public, private,
mission/faith-based, NGO, other - District and address / directions -
Main phone and email - Hospital administrator name and contact - PAM
contact person's name, job title, phone, email - Preferred communication
channel - Confirmation of authority to register facility assets -
Optional supporting document for verification - Verification status:
Draft / Pending / Verified / Changes requested / Rejected

### Hospital home dashboard

Show summary cards: - Total registered concentrators - Operational -
Needs assessment / maintenance due - Open requests - Work in progress -
Recently completed jobs

Primary actions: - Add concentrator - Request maintenance - View
equipment - View service history - View invoices / contract status (if
enabled) - Manage facility contacts - Contact support

### Add concentrator form

-   Asset tag / hospital asset ID
-   Manufacturer / brand
-   Model
-   Serial number
-   Ward / room / physical location
-   Approximate purchase or installation date (optional)
-   Warranty status and expiry (optional)
-   Last maintenance date (unknown allowed)
-   Current status: operational, degraded, not operational, unknown
-   Observed fault / notes
-   Optional equipment photo and rating plate photo
-   Whether voltage protection is present (yes/no/unknown)
-   Backup oxygen source available (yes/no/unknown)
-   Do not request patient names or patient records.

### Maintenance request

-   Select an asset.
-   Issue category: routine maintenance, unusual noise, alarm, low
    output/oxygen purity concern, power/electrical issue, physical
    damage, not functioning, other.
-   Describe symptoms and when they started.
-   Upload optional image; no patient-identifying information.
-   Urgency: routine, urgent, safety-critical (with explanatory text;
    admin validates classification).
-   Preferred availability and contact.
-   Confirm that emergency clinical needs should be handled through the
    facility's established clinical/oxygen contingency process; this app
    does not replace emergency care.
-   Request status and timestamps shown after submission.

### Hospital job detail

Display: - Asset and issue summary. - Work-order number and status
timeline. - Assigned engineer's approved professional profile and
contact method allowed by platform policy. - Scheduled visit, agreed
scope, and estimated labour/parts if available. - Checklist/report,
readings, work performed, parts used and recommendations. - Hospital
confirmation / issue escalation. - Invoice/payment status where
applicable. - Button to report an unresolved issue.

### Hospital profile/settings

-   Facility details and verification status.
-   Manage authorised users and PAM contacts.
-   Notification preferences.
-   Privacy, consent, support, sign out.

## 4. Biomedical engineer mobile experience

### Registration and profile

Fields: - Full legal/professional name and preferred display name -
Email and phone - District, town/base location, service radius -
Professional title - Qualifications, training institution, completion
year - Professional registration / licence details if applicable - Years
of experience - Skills and technical competencies - Concentrator
brands/models supported - Experience with testing instruments -
Availability (available / limited / unavailable) - Transport/access
capability - References or work history - Portfolio / certificates
uploaded privately - Consent to credential verification and platform
terms - Profile status: Incomplete / Pending verification / Verified /
Changes requested / Suspended

Never display private identity or credential documents publicly. Admins
see them only where required.

### Engineer dashboard

Cards: - Verification status - New eligible work orders - Assigned
jobs - Upcoming visits - Reports awaiting submission or review -
Completed jobs - Payment status (record only until a real payment
provider/finance process is integrated)

### Work order actions

-   View request and asset details relevant to the job.
-   View location and contact instructions.
-   Accept/decline invitation with reason.
-   Confirm schedule.
-   Mark en route (optional), arrived, in progress, parts required,
    completed pending review.
-   Use a mobile-friendly checklist.
-   Enter required manufacturer-appropriate measurements and units.
-   Record fault diagnosis, work performed, parts used, time spent,
    safety observations, follow-up recommendation.
-   Upload optional photos without patient information.
-   Save draft offline if technically supported, then sync safely;
    clearly show unsynced state.
-   Submit for technical review.
-   Do not allow an unverified engineer to accept safety-critical work.

### Engineer earnings / payment record

Show agreed fee, approved expenses, invoice/work-order reference,
approval status, and payment date/reference if paid. Do not display a
payment as completed until verified by the finance/admin process. Do not
collect card or mobile money PINs.

## 5. Admin mobile/responsive console

Admin screens: - Overview: pending hospitals, pending engineers, open
requests, overdue work, work awaiting review. - Engineer verification
queue. - Hospital verification queue. - Asset register search and
filters. - Maintenance request triage. - Assign or reassign engineer. -
Schedule service. - Review reports and request corrections. - Mark work
orders accepted / rejected / escalated. - Manage contracts, invoices and
payment records. - Reports by district, hospital, brand, fault category,
downtime and costs. - Audit log and role management (super-admin
only). - Suspend accounts or flag incidents with recorded reason. -
Export authorised operational reports to CSV.

Admin accounts must be invitation-only. Every approval, assignment,
status override, payment-status change, and credential decision must
create an audit event.

## 6. UI and interaction requirements

-   Design for Android-sized screens and intermittent connectivity.
-   Use a clean, trustworthy, healthcare-appropriate visual style.
-   Large touch targets, readable type, high contrast, clear status
    labels, accessible forms.
-   Use simple language and explain technical terms.
-   Keep forms in short steps with save-and-resume where appropriate.
-   Show empty states, skeleton/loading states, validation, offline
    state, success and error messages.
-   Do not use fake live data in production. Seed demo data only in a
    clearly labelled demo environment.
-   Use responsive layout for small phones, large phones and tablets.
-   Avoid excessive animation and heavy assets.
-   Use consistent status colours plus text/icons; never rely on colour
    alone.

## 7. Suggested primary navigation

Hospital: Home \| Equipment \| Requests \| Reports \| Profile\
Engineer: Home \| Work orders \| Schedule \| Reports \| Profile\
Admin: Overview \| Requests \| People \| Assets \| Reports \| Settings

## 8. Core data and security rules

Use a managed authentication service and a relational database. Enforce
server-side permissions / row-level security: - Hospitals can only
access facilities they belong to and their own assets, work orders,
reports and invoices. - Engineers can view only eligible open jobs or
jobs assigned to them and the minimum facility data needed to perform
the work. - Engineers can edit only their own profile and reports for
their assigned jobs. - Admins can access operations according to role. -
Only super-admins can grant admin privileges. - Private documents live
in protected storage, not public URLs. - Validate every field
server-side and restrict file type/size. - Record audit logs for
privileged actions. - Use backups, environment variables for secrets,
and rate limiting where available. - Collect only necessary data and
never collect patient records for this maintenance workflow.

## 9. Future marketplace-ready design

Keep healthcare-specific features in a separate module. Reusable future
modules may include: - Public provider profile and portfolio - Service
categories and skill tags - Job posts with budget and deadline -
Proposals/applications - Client-provider engagement - Messaging and
attachments - Milestones and deliverables - Reviews and dispute
management - Invoice/payment records - Search, filters, and provider
availability

Do not allow the general marketplace to bypass healthcare credential
checks. Do not build payment escrow without proper legal and
payment-provider support.

## 10. Definition of done for first release

-   All three account paths are represented, but admin access is
    restricted.
-   Hospital and engineer registration save data to a real backend.
-   Verification statuses are visible and enforced.
-   Hospitals can register assets and create maintenance requests.
-   Admin can verify accounts and assign work.
-   Engineers can access assigned jobs and submit service reports.
-   Hospital can view status and completed report.
-   Permissions are tested using separate test accounts.
-   Errors, empty states and loading states work.
-   No credentials or private hospital data are exposed in public pages.
-   Demo/test mode is clearly separated from production.
-   Include a README with setup, environment variables, database
    migrations, seed data, deployment steps and known limitations.
