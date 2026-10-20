# Concept 3: Website Application Product Specification

## OxygenCare Malawi web platform and future marketplace

**Audience:** Vibe-coding AI / full-stack developer\
**Product:** Responsive web application, with an admin console and
mobile-first pages

## 1. Objective

Build a polished responsive web platform for coordinating oxygen
concentrator maintenance in Malawi. The website should support public
information pages, hospital onboarding, biomedical engineer onboarding,
secure sign-in, role-specific dashboards, asset management, maintenance
requests, work orders, service reports, and administration.

Design the codebase modularly so a general services marketplace can
later be added. Do not implement the full general marketplace in the
initial release unless explicitly requested after the healthcare
workflow is validated.

## 2. Sitemap

### Public pages

-   `/` --- Landing page
-   `/how-it-works`
-   `/for-hospitals`
-   `/for-engineers`
-   `/impact`
-   `/about`
-   `/contact`
-   `/privacy`
-   `/terms`
-   `/sign-in`
-   `/sign-up`
-   `/forgot-password`
-   `/verify-account`

### Authenticated hospital pages

-   `/hospital/dashboard`
-   `/hospital/profile`
-   `/hospital/team`
-   `/hospital/equipment`
-   `/hospital/equipment/new`
-   `/hospital/equipment/[id]`
-   `/hospital/requests`
-   `/hospital/requests/new`
-   `/hospital/requests/[id]`
-   `/hospital/reports`
-   `/hospital/contracts`
-   `/hospital/invoices`
-   `/hospital/settings`

### Authenticated engineer pages

-   `/engineer/dashboard`
-   `/engineer/profile`
-   `/engineer/verification`
-   `/engineer/available-work`
-   `/engineer/work-orders`
-   `/engineer/work-orders/[id]`
-   `/engineer/schedule`
-   `/engineer/service-reports`
-   `/engineer/earnings`
-   `/engineer/settings`

### Admin pages

-   `/admin/dashboard`
-   `/admin/hospitals`
-   `/admin/hospitals/[id]`
-   `/admin/engineers`
-   `/admin/engineers/[id]`
-   `/admin/verification`
-   `/admin/assets`
-   `/admin/requests`
-   `/admin/work-orders`
-   `/admin/reports`
-   `/admin/contracts`
-   `/admin/invoices`
-   `/admin/users-and-roles`
-   `/admin/audit-log`
-   `/admin/settings`

Admin routes must be protected on the server, not just hidden from
navigation.

## 3. Landing page concept

### Hero

Headline: "Keep oxygen equipment ready when hospitals need it."
Supporting copy: "OxygenCare connects healthcare facilities with
verified biomedical professionals for scheduled maintenance, repairs,
and transparent equipment records." Primary CTA: "Register a hospital"
Secondary CTA: "Join as an engineer" Tertiary link: "Sign in"

### Supporting sections

1.  How it works: Register equipment → Request service → Qualified
    engineer performs work → Review service report.
2.  For hospitals: asset register, maintenance reminders, fault
    reporting, service history.
3.  For engineers: verified profile, relevant work opportunities,
    documented service delivery.
4.  Impact: only display real verified metrics. Until the pilot has
    data, use clearly labelled goals, not fabricated outcomes.
5.  Safety and trust: qualification checks, audit trail, technical
    review, privacy.
6.  Partners: show partner logos only with permission.
7.  Footer: contact, privacy, terms, support and social links only if
    real.

Do not claim partnerships, endorsements, service coverage, response
times, certifications, or impact figures that have not been verified.

## 4. Sign-up and sign-in flows

### Sign-up

Step 1: choose account type: - Hospital / Facility - Biomedical Engineer
/ Technician Admin must not be available as a public self-service role.
Provision admin accounts by secure invitation or controlled setup.

Step 2: basic account: - Name - Work email where available - Phone -
Password or configured secure auth method - Acceptance of terms and
privacy notice

Step 3: role-specific onboarding. - Hospital: facility identity,
district, ownership/type, main contact, PAM contact and initial asset
inventory. - Engineer: qualifications, experience, skills, supported
equipment, service area, availability and private credential uploads.

Step 4: submission confirmation with verification status and next steps.

### Sign-in

-   Email or phone as supported by the chosen auth provider.
-   Password / configured authentication.
-   Forgot password.
-   Clear invalid credential, disabled account, unverified account and
    network error messages.
-   Redirect to the appropriate dashboard based on server-verified role.
-   Prevent unauthorised role switching by editing a URL or client
    state.

## 5. Hospital experience

### Dashboard

Top cards: equipment count, operational count, due for maintenance, open
requests, overdue jobs. Below: equipment table, recent requests,
upcoming maintenance and alerts.

### Equipment table

Columns: asset tag, make/model, location, operational status, last
service, next due date, open request. Filters: district/facility (admin
only), brand, status, maintenance due. Hospital users see only their own
facility's records.

### Equipment detail

Display asset identity, manufacturer/model, serial number,
ward/location, condition, warranty status, service timeline, open
faults, reports and next service date. Keep serial numbers and other
operational information behind authentication.

### Request service

Use a guided form with asset selection, issue category, description,
urgency, contact and availability, optional photo, backup-oxygen status,
and confirmation. Validate required fields and show a generated request
number.

### Service report

Display technician, visit date, checklist, readings and units,
diagnosis, work completed, parts used, unresolved issues, follow-up
recommendation and technical-review status. Allow authorised hospital
staff to acknowledge receipt or flag unresolved work.

### Facility/team management

Hospital administrator can invite and remove team members, assign roles,
update PAM contact details and manage notification settings. Prevent
users from granting themselves elevated permissions.

## 6. Engineer experience

### Public profile (limited information)

Display approved name/display name, professional title, approved skills,
service area, supported equipment categories, verified status,
experience summary, and reviews only when authentic. Never publish
private credential files, personal address, identity documents, or
private contact details by default.

### Private engineer dashboard

Show verification state, profile completion, available eligible work,
assigned jobs, schedule, reports needing attention, completed work and
payment-record status.

### Work order details

Display the assigned facility contact, asset data necessary for the
task, fault description, schedule, agreed fee, scope and safety notes.
Do not expose unrelated facility assets or confidential hospital
information.

### Service report builder

Structured sections: - Arrival and assessment - Manufacturer/model and
asset verification - Approved checklist - Measurements with units and
testing instrument details where appropriate - Fault diagnosis - Work
performed - Parts and consumables - Remaining fault / parts required -
Safety and continuity notes - Recommendation and next service date -
Optional photos with no patient-identifying information - Engineer
attestation and submission

The system must support draft, submitted, correction requested,
approved, and rejected states. Technical review is mandatory where
configured. A service report must not automatically certify clinical
suitability unless the required tests and qualified approval have been
completed.

## 7. Admin console

Use a persistent left sidebar on desktop and compact navigation on
smaller screens. Include: - KPI cards: pending verification, open
requests, unassigned work, overdue work, reports awaiting review. -
Verification queues with approve / request changes / reject and
reason. - Hospital and engineer search, filters and profile review. -
Asset and maintenance request management. - Work-order assignment,
scheduling, reassignment and escalation. - Service report review. -
Contract and invoice record management. - Payment record updates with
reference and audit trail. - District, facility, equipment-brand, fault,
cost and downtime reporting. - User access and role administration. -
Audit log with actor, action, entity, timestamp and relevant metadata. -
Export filtered reports to CSV. All actions must have server-side
permission checks and create audit records.

## 8. Data model

Use PostgreSQL or equivalent relational database. Include migrations and
foreign keys.

### Main tables

`users` - id (UUID primary key) - full_name - email (unique where
provided) - phone - account_status - created_at - updated_at

`user_roles` - user_id - role (`hospital_user`, `engineer`, `admin`,
`finance`, `super_admin`) - granted_by - created_at

`engineer_profiles` - id - user_id - professional_title - bio -
district - service_radius_km - skills (structured relation or validated
tags) - supported_brands - availability - experience_years -
verification_status - created_at - updated_at

`engineer_credentials` - id - engineer_profile_id - document_type -
private_storage_path - issuer - registration_number (restricted if
applicable) - expiry_date (nullable) - review_status - reviewed_by -
reviewed_at

`hospitals` - id - name - facility_type - ownership_type - district -
address - phone - email - verification_status - created_at - updated_at

`hospital_memberships` - hospital_id - user_id - facility_role -
permissions - status

`facility_contacts` - id - hospital_id - contact_name - job_title -
phone - email - contact_type (administrator, PAM, biomedical, other)

`oxygen_assets` - id - hospital_id - asset_tag - manufacturer - model -
serial_number - location - operational_status - condition_notes -
installation_date - last_service_date - next_service_date -
warranty_status - backup_oxygen_status - created_at - updated_at

`maintenance_requests` - id - hospital_id - asset_id - created_by -
issue_category - description - urgency - status -
preferred_visit_window - created_at - updated_at

`contracts` - id - payer_type - payer_name_or_reference - scope -
start_date - end_date - status - budget_amount - currency

`work_orders` - id - maintenance_request_id - contract_id -
assigned_engineer_id - scheduled_at - agreed_labour_fee -
approved_parts_budget - status - assigned_by - created_at - updated_at

`service_reports` - id - work_order_id - submitted_by - assessment -
measurements_json (validated structure with units) - actions_taken -
parts_used - remaining_issues - recommendations - review_status -
reviewed_by - reviewed_at - completed_at

`invoices` - id - contract_id - work_order_id (nullable) - amount -
currency - due_date - status - external_reference - paid_at

`payment_records` - id - invoice_id or work_order_id - payee_reference -
amount - currency - status - transaction_reference - recorded_by -
recorded_at

`audit_logs` - id - actor_id - action - entity_type - entity_id -
metadata_json - created_at

Add created/updated timestamps, indexes for common searches, constraints
for valid status values, and soft deletion only where appropriate. Avoid
storing payment secrets.

## 9. Backend logic and permissions

-   Use trusted server-side sessions and role checks.
-   Apply row-level security / access policies.
-   A hospital member can access only facilities for which they have an
    active membership.
-   An engineer sees only eligible open jobs and their assigned work
    orders.
-   Admin access is invitation-only and role-scoped.
-   Only authorised staff may approve engineer credentials, verify
    hospitals, approve reports, edit contracts, or update payment
    status.
-   Validate all user input on server.
-   Restrict uploads by size, file type and access policy.
-   Rate-limit authentication and public forms.
-   Protect against insecure direct object references.
-   Keep an audit trail for approvals, assignment, report decisions,
    permission changes and finance changes.
-   Use environment variables for secrets. Never put service-role keys
    in client code.
-   Include database migrations, backup guidance, error handling, and
    basic monitoring.

## 10. Notifications

MVP: in-app notifications and email, if configured. Events: - Account
verification submitted / approved / changes requested. - New maintenance
request. - Work order assigned or rescheduled. - Engineer accepts or
declines assignment. - Job marked parts-required or escalated. - Service
report submitted, returned, or approved. - Upcoming maintenance due. -
Invoice approaching due date or marked paid. Notifications must not
include private credentials or unnecessary sensitive equipment details.

SMS and WhatsApp are optional integrations requiring actual provider
credentials and cost review; do not pretend they are active if not
configured.

## 11. Reports and analytics

-   Registered concentrators by facility, district, brand/model and
    status.
-   Preventive maintenance completed versus due.
-   Work-order backlog and ageing.
-   Median response and resolution time.
-   Downtime where reliably recorded.
-   Repair outcome and parts-required counts.
-   Labour, travel and parts costs per job and per asset.
-   Engineer jobs and payments recorded.
-   Contract coverage and renewal dates.
-   Export authorised datasets to CSV. Show the data date range and
    definitions. Use "target" or "illustrative" labels for future goals;
    never fabricate impact metrics.

## 12. Future marketplace module

Build as a separate domain module, with its own permissions and tables.

### Marketplace pages

-   `/marketplace`
-   `/marketplace/categories`
-   `/providers`
-   `/providers/[slug]`
-   `/jobs`
-   `/jobs/new`
-   `/jobs/[id]`
-   `/jobs/[id]/proposals`
-   `/engagements/[id]`
-   `/messages`
-   `/reviews`
-   `/disputes`
-   `/client/dashboard`
-   `/provider/dashboard`

### Job post fields

Title, description, category, required skills, budget type (fixed or
hourly), proposed budget/rate, currency, deadline, remote/on-site,
district/location, attachment, application deadline, visibility and
status.

### Provider profile

Display name, skills, services, biography, district/service area, remote
availability, hourly/fixed rates, portfolio, languages, verified badges
where actually verified, completed jobs and authentic reviews.

### Proposal fields

Job ID, provider ID, cover note, proposed price, estimated timeline,
relevant portfolio items, availability, status and timestamps.

### Engagement lifecycle

Draft → Published → Proposals received → Provider selected → Active →
Submitted for review → Revision requested / Approved → Completed →
Review. Include Cancelled and Disputed states.

### Marketplace safety and monetisation

-   Start with proposal-based matching: client posts a budget, providers
    apply with offers.
-   Do not automatically rank people only by lowest price; include
    relevant skills, verified credentials, portfolio and reliability.
-   Allow clients and providers to report suspicious accounts and block
    abusive users.
-   Define terms for scope changes, cancellations, refunds and disputes.
-   Start with recorded offline/mobile-money payments or invoices only
    if operationally clear; integrate payment providers later.
-   Do not claim escrow or guaranteed payment unless legally and
    technically implemented.
-   Consider a transparent service fee on completed transactions only
    after validating unit economics and local payment options.
-   Keep regulated work, especially medical equipment maintenance,
    behind a specialist credential and authorisation workflow.

## 13. Design system

-   Professional, clear, trustworthy, Malawi-first design.
-   Mobile-first responsive layouts; accessible contrast and keyboard
    navigation.
-   Consistent typography, spacing, forms, tables, badges and buttons.
-   Use a restrained healthcare palette; status always includes text,
    not colour alone.
-   Clear labels for "Pending verification", "Verified", "Needs
    attention", "Out of service", "Awaiting review" and "Paid".
-   Avoid invented testimonials, fake partner logos and unverified
    performance claims.
-   Use realistic but clearly labelled demo data for development.

## 14. Development phases

**Phase 0 --- Discovery:** validate users, payer, technical lead,
existing programmes, brands, regulations, service process and grant
scope.

**Phase 1 --- Healthcare MVP:** auth, roles, hospital onboarding,
engineer onboarding, credential verification, asset register,
maintenance request, assignment, service report, admin console, audit
logs and basic reports.

**Phase 2 --- Pilot improvements:** reminders, contract and invoice
records, notifications, offline-friendly forms, service-cost analytics
and operational exports.

**Phase 3 --- Marketplace beta:** job posts, provider profiles,
proposals, client selection, messaging, milestones, deliverables,
reviews and dispute handling.

**Phase 4 --- Marketplace operations:** compliant payments, payout
reconciliation, fraud prevention, organisation accounts, provider
subscriptions only if justified, and additional categories.

## 15. Required deliverables from the coding AI

1.  Working responsive application, not just static mockups.
2.  Authentication wired to a real backend.
3.  Database schema and migrations.
4.  Role-based authorisation enforced server-side.
5.  Functional hospital, engineer and admin flows.
6.  Forms with validation and useful errors.
7.  Seed data for a demo environment, clearly labelled.
8.  Automated tests for critical role permissions and work-order
    transitions.
9.  README covering setup, environment variables, migrations, seed data,
    deployment, backups and limitations.
10. `.env.example` without real secrets.
11. A clear list of features that are complete, mocked, or still require
    external provider configuration.

## 16. Final instruction to the coding AI

Prioritise a secure, end-to-end healthcare maintenance workflow. Do not
build a static dashboard that merely looks functional. Persist data,
enforce roles on the server, implement the core flows, and clearly
identify integrations that require credentials. Keep marketplace
features modular and out of the first pilot release.
