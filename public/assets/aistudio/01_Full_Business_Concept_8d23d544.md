# Concept 1: Full Business and Product Concept

## Working name: OxygenCare Malawi → Malawi Skills Marketplace

**Version:** 1.0 \| **Purpose:** Product vision, business model, scope,
and phased roadmap

## 1. Executive summary

OxygenCare is a digital coordination and service-delivery platform that
initially connects hospitals with verified biomedical engineers to
maintain existing oxygen concentrators. Hospitals register their
facilities and equipment, report faults, schedule preventive
maintenance, and track service histories. Verified engineers maintain
professional profiles, receive suitable work orders, document repairs,
and submit service reports. An administrator coordinates onboarding,
quality assurance, contracts, payments, and performance reporting.

The long-term vision is to evolve the platform into a Malawi-focused
services marketplace. Clients---individuals, households, businesses,
NGOs, and institutions---will post tasks or projects, propose budgets
and deadlines, and receive applications from people with relevant
skills. Workers and vendors will publish profiles, portfolios, rates,
availability, and service areas. Clients will compare applicants, agree
terms, track delivery, and review completed work.

**Launch principle:** validate the healthcare maintenance service first.
Design the software modularly for later expansion, but do not launch a
general-purpose marketplace in the first D-Prize pilot.

## 2. The problem

-   Hospitals may own oxygen concentrators without reliable preventive
    maintenance, repair access, spare-parts sourcing, or complete
    service records.
-   Hospitals may not know which qualified technician is available,
    while technicians may struggle to find reliable paid work.
-   Maintenance funding and responsibility can be fragmented across
    facilities, health authorities, NGOs, donors, and equipment
    suppliers.
-   Outside healthcare, people and businesses in Malawi need an
    accessible way to find local talent for short tasks and projects,
    including data entry, design, research assistance, repairs,
    administration, writing, IT support, and other services.

## 3. The solution

### Initial product: OxygenCare

A managed maintenance network, supported by software, with: 1. Hospital
and facility onboarding. 2. Oxygen concentrator asset register. 3.
Verified biomedical engineer directory. 4. Maintenance request and
work-order workflow. 5. Scheduling and engineer assignment. 6. Service
reports, measurements, parts used, photos where appropriate, and
follow-up. 7. Contract, invoice, and payment tracking. 8. Dashboards for
hospitals and administrators. 9. Maintenance reminders and
downtime/performance reporting.

The enterprise---not merely the app---will coordinate service delivery
and quality. Qualified personnel must carry out and verify technical
work within their competence and applicable regulations.

### Future product: Malawi Skills Marketplace

A multi-category marketplace with two main sides: - **Clients /
hirers:** publish tasks, set budgets, deadlines, locations,
remote/on-site preferences, and required skills; review applications and
portfolios; hire a provider; track milestones; approve deliverables;
leave reviews. - **Workers / vendors:** create profiles, list skills and
services, upload portfolios, set rates and availability, browse jobs,
submit proposals, communicate with clients, track work, and receive
payments through supported methods.

Healthcare equipment maintenance can remain a specialist category with
stricter credential checks and safety controls. General marketplace
users must not automatically gain access to regulated technical work.

## 4. Target users

### Phase 1

-   Public, private, and mission hospitals and clinics.
-   Hospital administrators and Physical Asset Management (PAM)
    contacts.
-   Biomedical engineers and appropriately qualified technicians.
-   District health offices, health authorities, NGOs, donors, equipment
    suppliers, and maintenance partners.
-   Platform operations and quality-assurance administrators.

### Future phase

-   Individuals and households.
-   SMEs and larger businesses.
-   NGOs and development organisations.
-   Skilled freelancers, tradespeople, vendors, consultants, and service
    providers.
-   Recruiters or project managers acting for organisations.

## 5. Who pays?

The app does not itself create demand or funding. Revenue must come from
contracts and services.

Potential Phase 1 payers: 1. District or national health authorities
contracting maintenance across multiple facilities. 2. NGOs, donors, or
implementation partners funding maintenance for underserved facilities.
3. Hospitals purchasing annual service packages. 4. Private and mission
hospitals purchasing routine service and repair contracts. 5. Equipment
suppliers outsourcing approved local service work.

Recommended pilot strategy: seek a funded service contract or pilot
sponsor covering defined maintenance deliverables at two or three
hospitals. Validate real budgets and procurement processes before
relying on hospital subscriptions. Avoid charging patients directly for
maintenance.

Potential future marketplace revenue: - A clearly disclosed commission
or service fee on successfully completed jobs. - Business or
institutional subscriptions for hiring tools, multiple users, and
reporting. - Optional promoted listings only if transparent and not
misleading. - Managed procurement or service contracts for
organisations. Do not charge workers simply to apply for jobs at launch.
Do not introduce escrow or hold client funds unless payment, legal,
compliance, and provider arrangements support it.

## 6. Core user journeys

### Hospital onboarding

1.  A user selects "Hospital / Facility".
2.  Creates an account and verifies email or phone when configured.
3.  Submits facility name, facility type, district, address, facility
    contacts, and PAM contact details.
4.  Adds oxygen concentrators: make, model, serial number, asset tag,
    location/ward, condition, last service, warranty status, known
    fault, and optional photo.
5.  The platform marks the facility as pending verification.
6.  Admin verifies the facility and authorises service requests.
7.  Hospital dashboard displays registered equipment, upcoming
    maintenance, open jobs, service history, and reports.

### Engineer onboarding

1.  A user selects "Biomedical Engineer / Technician".
2.  Creates an account.
3.  Submits name, contact details, location/service radius,
    qualifications, training, work experience, competencies,
    brands/models supported, availability, and references.
4.  Uploads credentials for admin review; sensitive documents are
    private and access-controlled.
5.  Admin approves, rejects, or requests more information.
6.  Approved engineers can view eligible work orders and submit
    availability or accept assigned work.
7.  Engineer completes the work order with checklist, findings,
    measurements, parts, actions, time, and a report.
8.  Hospital contact confirms receipt; authorised technical
    reviewer/admin validates completion before payment approval.

### Admin onboarding and operations

1.  Admin accounts are created by a secure, controlled process---not
    public unrestricted registration.
2.  Admin reviews facilities, engineer credentials, asset records,
    service requests, reports, complaints, and payments.
3.  Admin assigns engineers, manages work-order status, records
    funding/contract source, and tracks service-level targets.
4.  Every privileged action is logged.

### Future general marketplace journey

1.  Client signs up and creates a client profile.
2.  Client posts a task: title, description, category, skills,
    budget/rate type, deadline, location, remote/on-site, attachments,
    and application deadline.
3.  Providers discover jobs and submit proposals with price, cover note,
    timeline, and relevant portfolio.
4.  Client compares profiles, proposals, ratings, availability, and past
    work.
5.  Client selects a provider and agrees scope, price, deadlines, and
    milestones.
6.  Work proceeds through status updates and messages.
7.  Client reviews the deliverable and approves completion.
8.  Payment is processed using a supported, compliant payment flow; both
    parties may leave reviews.
9.  Disputes follow a documented review process.

## 7. Roles and permissions

-   **Public visitor:** browse public pages and approved provider
    profiles; cannot see private contact details or confidential jobs.
-   **Hospital user:** manage their own facility and assets; create and
    view their own work orders; access their service reports and
    invoices.
-   **Engineer:** manage their own profile and submitted documents; see
    only eligible or assigned work orders; submit reports for their
    work.
-   **Admin / operations:** verify users, facilities, equipment, jobs,
    and service reports; manage categories and operations.
-   **Finance role (later):** view invoices, payment status,
    reconciliations, and approved payouts; cannot alter technical
    reports.
-   **Super admin:** manage roles, settings, audit logs, and admin
    access. Use least-privilege permissions. Do not rely on hiding UI
    elements alone; enforce access on the server/database.

## 8. Initial MVP requirements

### Must have

-   Responsive website and mobile-friendly experience.
-   Sign up, sign in, sign out, password reset, and session handling.
-   Three entry paths: Biomedical Engineer, Hospital / Facility, Admin
    (admin account creation restricted).
-   Profile and facility onboarding.
-   Engineer credential verification workflow.
-   Oxygen concentrator asset register.
-   Maintenance request / work-order creation.
-   Assignment, status tracking, service checklist and report.
-   Hospital, engineer, and admin dashboards.
-   Search/filter by district, status, equipment, skill, and
    availability.
-   Notifications in-app and email; SMS/WhatsApp may be added only
    through configured providers.
-   Audit log for sensitive changes.
-   Privacy notice, terms, consent, and secure file upload.
-   Seed/demo data clearly labelled as demo.

### Later, not MVP

-   Public multi-category freelance marketplace.
-   In-app chat with attachments.
-   Online payment, mobile money integration, escrow, and automated
    payouts.
-   Native iOS/Android apps.
-   AI job matching, predictive maintenance, and automated quotation.
-   Inventory purchasing and supplier marketplace.
-   Multi-country expansion.

## 9. Technical product architecture

Build as a modular web application first, with responsive mobile
layouts. A progressive web app (PWA) is a practical starting point;
native mobile apps can follow after usage is validated.

Suggested architecture: - Frontend: React / Next.js with TypeScript,
accessible responsive UI. - Backend and database: Supabase (PostgreSQL,
Auth, Storage, Row Level Security) or an equivalent managed stack. -
Database: relational, with explicit foreign keys, constraints, and
migrations. - File storage: private buckets for engineer credentials and
restricted service attachments; signed, time-limited access where
appropriate. - Notifications: email first; SMS or WhatsApp only after
provider configuration. - Deployment: managed hosting with environment
variables, preview deployments, backups, and error monitoring. If the
chosen coding platform supplies its own stack, adapt these principles
rather than forcing a particular vendor.

## 10. Core data entities

-   User: id, full_name, email, phone, role, account_status, created_at.
-   EngineerProfile: user_id, professional_title, bio, district,
    service_radius, skills, supported_brands, availability,
    verification_status, experience_years.
-   Credential: engineer_id, document_type, private_file_path, issuer,
    expiry_date if relevant, review_status, reviewer_id.
-   Hospital: id, name, facility_type, district, address,
    ownership_type, verification_status.
-   HospitalMembership: hospital_id, user_id, position, permissions,
    status.
-   FacilityContact: hospital_id, contact_name, role/title, phone,
    email, preferred_contact_method.
-   OxygenAsset: hospital_id, asset_tag, manufacturer, model,
    serial_number, location, condition, installation_date,
    last_service_date, next_service_date, warranty_status,
    operational_status.
-   MaintenanceRequest: hospital_id, asset_id, issue_type, description,
    urgency, opened_by, status, created_at.
-   WorkOrder: request_id, assigned_engineer_id, scheduled_at, status,
    contract_id, agreed_fee, approved_parts_budget.
-   ServiceReport: work_order_id, checklist, readings, fault_found,
    actions_taken, parts_used, recommendation, completed_at,
    submitted_by, review_status.
-   Contract: payer_type, payer_id, scope, start_date, end_date,
    coverage, status, budget.
-   Invoice / PaymentRecord: contract or work order reference, amount,
    currency, status, due date, paid date, external transaction
    reference. Never store raw payment credentials.
-   Review / Complaint: related work order, author, rating, comment,
    status.
-   AuditLog: actor_id, action, entity_type, entity_id, timestamp,
    metadata.
-   Future marketplace entities: ClientProfile, ProviderService,
    JobPost, Proposal, Engagement, Milestone, Message, Deliverable,
    Review, Dispute, and PayoutRecord.

Use MWK as the default displayed currency for Malawi. Allow configurable
currencies for later expansion. Store timestamps consistently and
display local time appropriately.

## 11. Maintenance workflow and safety

Work-order statuses: Draft → Submitted → Under review → Approved →
Assigned → Scheduled → In progress → Awaiting review → Completed.
Additional statuses: Rejected, Cancelled, On hold, Parts required, and
Escalated.

Record whether a machine is operational, restricted, or out of service.
Do not represent a machine as clinically safe solely based on a
self-reported checklist. Require qualified assessment and
manufacturer-appropriate testing. A facility must confirm that an
appropriate backup oxygen source and continuity plan are in place before
maintenance that could interrupt oxygen delivery. Escalate
safety-critical failures and do not encourage unqualified repairs.

## 12. Impact metrics

Pilot metrics: - Number of facilities onboarded and verified. - Number
of concentrators registered and assessed. - Number serviced, repaired,
restored, or identified as requiring parts. - Proportion meeting
applicable manufacturer specifications after service. - Downtime and
time from request to first response / resolution. - Cost per
concentrator serviced. - Number of verified engineers earning paid
work. - Hospital satisfaction and willingness to renew or fund
contracts. - Service coverage by facility and district. Patient outcomes
should not be attributed to the platform without an appropriate
evaluation design and reliable clinical data.

## 13. Pilot and scale roadmap

**Pre-pilot (4--6 weeks):** interview hospital managers, PAM staff,
biomedical engineers, relevant health authorities and existing oxygen
programmes; map equipment and brands; verify legal/procurement
requirements; obtain letters of interest; identify a qualified technical
lead and potential payer.

**Months 1--3:** pilot with 2--3 hospitals and 15--20 concentrators. Use
a lightweight app and a small approved technician network. Measure
costs, reliability, response time, and willingness to pay.

**Months 4--12:** improve the workflow, renew or secure service
contracts, expand to additional facilities only where technical capacity
and funding exist.

**Years 2--5:** expand by geographic clusters and institutional
contracts, with a goal of serving at least 100 hospitals by year five if
demand and economics support it.

**After the healthcare model is proven:** launch general job posting,
provider profiles, proposals, messaging, milestones, reviews, and
compliant payment options as a separate marketplace module.

## 14. Risks and mitigations

-   **No one pays:** validate funding before building extensively;
    secure a sponsor or pilot contract.
-   **Overlap with existing programmes:** map current services and
    define an unmet need or partnership opportunity.
-   **Insufficient qualified technicians:** verify credentials, recruit
    a technical lead, and train facility personnel only for appropriate
    routine tasks.
-   **Parts unavailable:** inventory brands and suppliers before
    promising repair times; distinguish labour from parts.
-   **Safety incident:** qualified personnel, manufacturer instructions,
    clear escalation, appropriate backup oxygen and auditable reports.
-   **Late institutional payments:** avoid promising engineer payouts
    before funds and terms are agreed; maintain working capital.
-   **Marketplace fraud or disputes:** verified accounts, clear terms,
    report/block controls, documented scope and dispute process.
-   **Privacy and data exposure:** collect minimum necessary
    information, restrict credential files, enforce server-side
    permissions, maintain backups and audit logs.
-   **Scope creep:** keep general marketplace features out of the
    D-Prize pilot.

## 15. Positioning statement

"OxygenCare helps healthcare facilities keep existing oxygen
concentrators safe, functional, and maintained by connecting them with
verified technical professionals and providing a transparent record of
every service."

Future positioning: "A trusted Malawi-first marketplace where people and
organisations can find skilled service providers, post paid work,
compare proposals, and manage projects with greater confidence."

## 16. Decisions to validate before launch

1.  Who is the legal operator and contracting party?
2.  Which hospitals have concentrators that need maintenance and are not
    adequately served?
3.  Which organisation will fund the first three months?
4.  Who is the qualified technical lead?
5.  Which brands, tools, spare parts, and regulatory requirements apply?
6.  What payment and procurement terms are realistic?
7.  What minimum platform can safely support the pilot?
