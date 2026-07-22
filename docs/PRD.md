# Product Requirements Document — BigBrotherALPRDemo

**Status:** Draft
**Owner:** Chris (heresjones)
**Last updated:** 2026-07-22

---

## 1. Purpose of this document

This PRD defines what BigBrotherALPRDemo is, who it's for, and what it does
— at two levels of ambition:

- **Vision** — a directionally realistic model of a commercial ALPR
  (Automated License Plate Recognition) SaaS platform, in the style of
  products like Flock Safety. This gives the demo a coherent north star so
  feature decisions aren't made in a vacuum.
- **Demo scope** — the actual, buildable subset of that vision that this
  repo will implement: single-tenant, single-developer-operable, deployable
  by anyone into their own AWS account, with no dependency on real
  government systems, real camera hardware, or real law-enforcement data
  agreements.

Everything in this document should be read through that lens: **wide
vision, narrow demo**. Sections are explicitly tagged `[VISION]` or
`[DEMO]` throughout so it's always clear what's aspirational modeling vs.
what actually gets built.

This PRD supersedes nothing in
[`.claude/skills/alpr-demo-infra/SKILL.md`](../.claude/skills/alpr-demo-infra/SKILL.md)
— that doc remains the source of truth for the concrete API contract, data
shapes, and deploy process. This PRD is one layer up: it's *why* those
choices were scoped the way they were, and *what's next*.

---

## 2. Background

ALPR (also LPR, or ANPR outside the US) systems use cameras and image
processing to detect vehicles, read license plates, and log a timestamped
record — typically including location, a vehicle image, and attributes
like color, make, and model. Commercial platforms in this space (Flock
Safety being the most visible example) are not just camera admin panels.
They're investigation and compliance platforms built around five core
capabilities:

1. Turning raw camera detections into **searchable events**
2. Matching detections against **hotlists/watchlists** to generate alerts
3. Giving investigators **structured search tools** (plate, vehicle
   attributes, location, time window)
4. Enabling **controlled data sharing** between organizations
5. Providing **audit trails and compliance reporting** for every search and
   every share

That five-part shape — ingest, alert, search, share, audit — is the
organizing idea for this PRD, not "a dashboard with camera feeds."

---

## 3. Goals

- **G1 [DEMO]** — Demonstrate an end-to-end ALPR pipeline: photo in
  (Android app or web), structured record out (plate, vehicle attributes,
  location, time), searchable in a dashboard.
- **G2 [DEMO]** — Be deployable by any third party into their own AWS
  account with their own credentials and API keys, in under 30 minutes,
  following only the README and skill doc.
- **G3 [DEMO]** — Model the *shape* of investigation, alerting, and audit
  workflows realistically enough to be a credible architecture reference,
  even where the underlying data is simulated.
- **G4 [VISION]** — Illustrate, through UI and data model, what a
  multi-tenant, multi-agency ALPR platform's information architecture looks
  like (roles, sharing, hotlists, transparency reporting), without actually
  building multi-tenancy.

### Non-goals

- **Not a production surveillance system.** No real camera hardware, no
  live video, no integration with NCIC, AMBER Alert systems, or any real
  government hotlist. Every "hotlist" or "alert" in this repo is
  user-defined demo data.
- **Not multi-tenant.** One deploy = one organization, one AWS account, one
  set of data. No cross-organization sharing infrastructure will actually
  move data between AWS accounts.
- **Not a compliance-certified product.** Audit logging is modeled for
  realism, not built to meet any actual regulatory standard (CJIS, etc.).
- **Not optimized for scale.** Built for demo-sized data volumes (tens to
  low thousands of records), not a real metro camera network.

---

## 4. Users / personas

Even in demo form, the product should be legible through the lens of who'd
actually use the real thing:

| Persona | Role | What they need from the product |
|---|---|---|
| **Org Admin** | Configures the org, manages users/roles, oversees cameras | Visibility into system health, users, and settings |
| **Investigator / Analyst** | Runs searches, builds evidence, reviews hits | Fast, filterable search over records; ability to save/export findings |
| **Patrol / Field User** | Uploads photos from the field (the Android app) | A dead-simple capture-and-upload flow with no friction |
| **Auditor / Compliance Reviewer** | Reviews who searched what, and why | A read-only audit trail: user, timestamp, query, justification |
| **Camera/Device Operator** *(vision only)* | Manages physical device health | Device status, battery, connectivity — not applicable to this demo since there's no physical camera hardware, only app uploads |

The demo's frontend (Section 8) primarily serves **Investigator/Analyst**
and **Org Admin**; the Android app serves **Patrol/Field User**.

---

## 5. Product principles

1. **Every search is attributable.** No anonymous queries — even in a
   single-user demo, the data model carries a `requestedBy` and `reason`
   field on searches, because that's the single most load-bearing privacy
   control in real ALPR systems and it should never be an afterthought.
2. **Simulated data stays obviously simulated.** Hotlists, alerts, and
   sharing relationships in the demo are clearly labeled as demo data —
   never presented in a way that could be mistaken for a live law
   enforcement feed.
3. **Retention is a first-class setting, not a missing feature.** Even in
   demo form, records should carry an expiry/retention concept, because
   "how long is this data kept" is a core compliance question for this
   category of product, not a stretch feature.
4. **Least privilege by default.** Roles are scoped down, not up. A new
   role starts with no permissions and capabilities are added explicitly.
5. **Don't fake capability the demo can't back up.** No live video, no
   real hotlist integrations, no cross-agency sharing — if it's not real,
   it's either left out or explicitly marked as a mock in the UI (as the
   frontend already does today with the mock-data banner).

---

## 6. Information architecture

Eleven-module navigation, modeled on the researched product shape. Each is
scoped `[DEMO]` (build it, simplified) or `[VISION]` (describe it here for
completeness; not built in this repo):

1. **Overview** — `[DEMO, simplified]`
2. **Live Map** — `[VISION]`
3. **Vehicle Search** — `[DEMO]`
4. **Video** — `[VISION]`
5. **Alerts** — `[DEMO, simplified]`
6. **Investigations** — `[DEMO, simplified]`
7. **Cameras & Health** — `[VISION]` (no physical cameras in this demo —
   uploads come from the Android app and web, not fixed devices)
8. **Sharing** — `[VISION, UI-only mock]`
9. **Insights & Audit** — `[DEMO, simplified]`
10. **Users & Roles** — `[DEMO, simplified]`
11. **Organization Settings** — `[DEMO, simplified]`

---

## 7. Functional requirements by module

### 7.1 Overview `[DEMO, simplified]`

Purpose: org-wide snapshot on login.

- FR-1.1: Show total record count and a simple trend (records per day,
  last 14 days).
- FR-1.2: Show count of searches performed, last 7/30 days.
- FR-1.3: Show count of active alerts (hotlist matches).
- FR-1.4: Show most recent N records (link into Vehicle Search / record
  detail).
- Explicitly **not built**: camera health tiles, battery/latency widgets
  (no physical cameras exist in this demo), cross-org sharing tiles.

### 7.2 Live Map `[VISION]`

Real product shows camera locations and live detections on a map.

- This demo has no fixed camera network — location data comes from
  optional lat/lon on each upload. A **future** demo enhancement could plot
  uploaded records as pins on a map (this is realistic to build later,
  since the data model already carries `latitude`/`longitude`), but it is
  not part of current scope. Recorded here so it isn't lost.

### 7.3 Vehicle Search `[DEMO]`

This is the core of the product — already partially built (Section 8).

- FR-3.1: Full or partial plate text search.
- FR-3.2: Filter by vehicle color.
- FR-3.3: Filter by vehicle type (sedan, SUV, truck, etc. — from
  Rekognition labels, per the skill doc's documented limitations).
- FR-3.4: Filter by date/time range.
- FR-3.5: Filter by location radius, if lat/lon present on the record.
- FR-3.6: Every search is logged: who searched, what query, when, and —
  for parity with the audit principle in Section 5 — an optional free-text
  reason field, surfaced in the UI as "Reason for search (optional in
  demo)".
- FR-3.7: Result cards show plate, confidence, vehicle attributes, image,
  timestamp, location.
- Explicitly **not built**: "similar vehicle" visual search, convoy/
  multi-location correlation search — these require ML capability well
  beyond Rekognition's out-of-the-box features and are `[VISION]` only.

### 7.4 Video `[VISION]`

Real product distinguishes LPR-only cameras (image detections) from video
products (live/recorded video, clip download). This demo only ever
produces single still images per upload — there is no live video path, no
VMS, no clip storage. Recorded here as an explicit boundary so it's never
assumed to exist.

### 7.5 Alerts `[DEMO, simplified]`

- FR-5.1: Org Admin can create a **custom hotlist**: a named list of plate
  numbers (exact or partial match) with a reason/description.
- FR-5.2: On ingest, the backend checks the detected plate against active
  hotlist entries. A match creates an **Alert** record.
- FR-5.3: Alerts list view: plate, matched hotlist, record, timestamp,
  status (new / reviewed / dismissed).
- FR-5.4: A user can mark an alert reviewed/dismissed with an optional
  note.
- Explicitly **not built**: NCIC, AMBER Alert, or any real government
  hotlist feed. Every hotlist in this repo is user-created demo data —
  this is a hard boundary, not a placeholder waiting to be filled in.

### 7.6 Investigations `[DEMO, simplified]`

Real products let investigators group related records/evidence into a
case.

- FR-6.1: A user can create a named **Investigation** and attach one or
  more records to it.
- FR-6.2: Investigation detail view lists attached records with notes.
- FR-6.3: Investigations are exportable as a simple JSON or PDF-style
  summary (record list + notes) for demo purposes.
- Explicitly **not built**: evidence export to third-party systems (e.g.
  Axon) — `[VISION]` only, no such integration exists or is planned.

### 7.7 Cameras & Health `[VISION]`

No physical camera fleet exists in this demo — uploads originate from an
Android app and a web form, not fixed devices with battery/connectivity
telemetry. If this demo ever adds simulated "virtual cameras" (e.g.
tagging uploads with a named upload-source), that's a possible future
increment, not current scope.

### 7.8 Sharing `[VISION, UI-only mock]`

Cross-organization sharing is central to the real product but requires
real multi-tenancy this demo deliberately doesn't build (Section 3,
non-goals).

- A **mock** Sharing screen may be built purely as an information-
  architecture illustration: static, clearly-labeled example data showing
  what a sharing-relationships table would look like (organization name,
  scope of access, date). It performs no real cross-account data movement.
  This is explicitly cosmetic and should be labeled as such in the UI,
  consistent with Principle 2.

### 7.9 Insights & Audit `[DEMO, simplified]`

- FR-9.1: Audit log view: every search (FR-3.6) and every alert
  disposition (FR-5.4) appears in a single chronological log.
- FR-9.2: Log entries show: user, action type, timestamp, and relevant
  detail (query text / alert id).
- FR-9.3: Log is read-only in the UI — no deleting or editing audit
  entries, by anyone, including Org Admin. This is a deliberate integrity
  requirement, not an oversight.
- FR-9.4: Basic usage metrics: searches per user, alerts per week — reuses
  Overview's aggregation logic.

### 7.10 Users & Roles `[DEMO, simplified]`

- FR-10.1: Users list: name/email, role, active/inactive.
- FR-10.2: A small fixed set of built-in roles for the demo (not a full
  role builder): **Admin** (full access), **Investigator** (search +
  alerts + investigations), **Viewer** (read-only search).
- FR-10.3: Admin can deactivate/reactivate a user.
- Explicitly **not built**: custom per-camera/per-network permission
  scoping, MFA enforcement, SSO — real auth is `[VISION]`; see Section 9 for
  what demo auth actually is (the shared API key from the skill doc).
  Building real per-user auth (Cognito or similar) is a reasonable phase-2
  increment and is called out as an open question in Section 13, not
  committed to here.

### 7.11 Organization Settings `[DEMO, simplified]`

- FR-11.1: Org name, retention period setting (days after which records
  are eligible for deletion — enforcement can be a documented manual step
  or a scheduled Lambda in a later phase, not required for MVP).
- FR-11.2: API key rotation entry point (regenerate the shared demo key;
  see skill doc's auth model).
- Explicitly **not built**: a public transparency portal. This is a
  genuinely good idea from the real product (Section 1's research) and is
  listed as a `[VISION]` idea worth revisiting once there's a real audit
  log to publish from (Section 13).

---

## 8. Current implementation status (as of 2026-07-22)

For traceability against this PRD:

- **Frontend (`frontend/`)** — built as a full SaaS shell, all against
  **mock/session data** — no backend exists yet:
  - Sidebar + top bar shell (React Router) covering all 11 IA modules from
    Section 6. `[VISION]`-only items (Live Map, Video, Cameras & Health)
    render as disabled nav entries; Sharing renders its illustrative mock
    page (7.8).
  - **Overview** — stat tiles (records, searches, active alerts, hotlist
    entries) with a records-per-day sparkline; recent records.
  - **Vehicle Search** — FR-3.1–3.6 implemented: plate/color/type/date
    filters, optional reason field, and every search is logged to the
    audit trail (session-only, resets on reload).
  - **Alerts** — FR-5.1–5.4: hotlist list + create form, alert review/
    dismiss actions, all logged.
  - **Investigations** — FR-6.1–6.2: create, attach records, detail view.
    FR-6.3 (export) not built.
  - **Insights & Audit** — FR-9.1–9.4: read-only chronological log fed by
    search and alert actions, plus per-user search counts.
  - **Users & Roles** — FR-10.1–10.3: fixed Admin/Investigator/Viewer
    roles, activate/deactivate, gated to the Admin role.
  - **Organization Settings** — FR-11.1–11.2: org name, retention days,
    mock API key rotation, gated to Admin.
  - A top-bar "Acting as" switcher previews role-gating (Section 5,
    Principle 4) without real auth — see Section 13, open question 1.
  - All of the above resets on page reload; there is no persistence layer
    yet, by design, until Phase 1 lands.
- **Backend (`backend/`)** — not built. Skill doc defines the intended
  `POST /uploads` / `GET /records` contract.
- **Infra (`infra/`)** — not built. Skill doc defines the intended
  Terraform resources.
- **Android app (`android/`)** — not built.

---

## 9. Data model

Extends the `AlprRecord` type already defined in
`frontend/src/types.ts` and the skill doc. New entities introduced by this
PRD:

```
Organization
  id, name, retentionDays, apiKeyRotatedAt

User
  id, name, email, role (Admin | Investigator | Viewer), active: boolean

AlprRecord   (already defined — see skill doc)
  + requestedBy / capturedVia (android | web), for provenance

SearchLogEntry
  id, userId, queryText, filters (plate/color/type/dateRange/location),
  reason (optional), performedAt

Hotlist
  id, name, description, createdBy, active: boolean

HotlistEntry
  id, hotlistId, plateText (exact or partial), note

Alert
  id, recordId, hotlistId, matchedPlateText, status (new | reviewed | dismissed),
  reviewedBy, reviewNote, createdAt

Investigation
  id, name, createdBy, createdAt, notes

InvestigationRecord
  investigationId, recordId, note

AuditLogEntry
  id, actorUserId, actionType (search | alert_review | user_change | settings_change),
  detail, occurredAt
```

Notes:

- `SearchLogEntry` and `AlertReview` actions both feed into
  `AuditLogEntry` (FR-9.1) — either as the same table or a view over both,
  implementation detail for later.
- None of this is implemented yet outside `AlprRecord`. This is the target
  shape for backend/database work once building resumes past the
  frontend-only mock stage.

---

## 10. Non-functional requirements

- **NFR-1 Deployability** — `terraform apply` in a clean AWS account with
  no manual console steps, per the skill doc's deploy flow (G2).
- **NFR-2 Cost** — demo-scale AWS usage should stay within typical free-tier
  or low-single-dollar monthly cost for light use; no resources that accrue
  significant idle cost (e.g. no NAT gateways, no provisioned-capacity
  DynamoDB).
- **NFR-3 Privacy-by-default** — S3 bucket never public; all reads via
  short-TTL presigned URLs (already specified in skill doc).
- **NFR-4 Auditability** — FR-9.3's audit-log immutability is a hard
  requirement, not best-effort.
- **NFR-5 Honesty about detection limits** — anywhere vehicle make/model is
  displayed, show "Unknown" rather than fabricating a value (already
  implemented in the frontend; carries forward as a standing requirement
  per the skill doc).
- **NFR-6 Accessibility** — frontend should be usable via keyboard and
  meet basic contrast requirements; not WCAG-certified, but not ignored.
- **NFR-7 Teardown** — `terraform destroy` must cleanly remove all
  resources with no orphaned cost-accruing infrastructure.

---

## 11. Success criteria for the demo

Since this isn't a commercial product, "success" means the demo does its
job:

- A new user can go from `git clone` to a working end-to-end upload →
  detect → search flow in under 30 minutes using only the README.
- Every module marked `[DEMO]` in Section 6 is reachable from the UI and
  backed by real (if simulated) data — not a static mock permanently.
- Every module marked `[VISION]` is clearly absent or clearly labeled as
  illustrative, never silently implied to be real.
- A reviewer reading this PRD next to the running app can point to exactly
  which FRs are implemented and which aren't (Section 8 stays current).

---

## 12. Phased roadmap

| Phase | Scope | Status |
|---|---|---|
| **0** | Architecture defined (skill doc), frontend scaffold with mock data | ✅ Done |
| **1** | Real backend: `infra/` (Terraform) + `backend/` (ingest + records Lambdas) per skill doc contract; frontend switched from mock data to real API calls | Not started |
| **2** | Vehicle Search filters beyond plate (color/type/date/location — FR-3.2–3.5); Alerts + custom hotlists (FR-5.x) | ✅ Frontend done (mock/session data); needs Phase 1 to be real |
| **3** | Investigations (FR-6.x); Insights & Audit log (FR-9.x); basic Users & Roles (FR-10.x) | ✅ Frontend done (mock/session data); needs Phase 1 to be real |
| **4** | Android app (`android/`), wired to the real upload endpoint | Not started |
| **5 (stretch)** | Org Settings retention enforcement; mock Sharing screen (Section 7.8); map view on Overview/Vehicle Search using existing lat/lon data | Org Settings UI + Sharing mock done; retention enforcement and map view not started |

Phase order is a recommendation, not a constraint — Phase 4 (Android) could
reasonably move earlier if a real device demo is wanted sooner, since it
only depends on Phase 1's upload endpoint existing.

**Note on sequencing:** Phases 2, 3, and part of 5 got built at the UI layer
ahead of Phase 1 (frontend-first, on mock/session data) rather than in the
original order — reasonable for shaping the full IA quickly, but it means
Phase 1 now needs to backfill real persistence and auth (Section 13, open
question 1) behind an already-built UI, not the other way around.

---

## 13. Open questions

1. **Real per-user auth** — the skill doc's shared API key is fine for a
   solo demo but breaks FR-9.1/FR-3.6's "every search is attributable"
   principle the moment more than one person uses a deployment. Does this
   demo need real auth (e.g. Cognito) before Users & Roles (Phase 3) is
   worth building, or is a client-supplied username on each request (no
   real auth, just attribution) good enough for demo purposes?
2. **Retention enforcement** — is a documented manual `aws` CLI step
   sufficient for FR-11.1, or does this need a scheduled Lambda?
3. **Map view** — worth pulling into Phase 2 given the data model already
   supports it (lat/lon), or stay deferred to Phase 5?
4. **Hotlist match logic** — exact match only, or partial/fuzzy match on
   `HotlistEntry.plateText`? Affects Alert false-positive rate even in
   demo form.

These should be resolved before their respective phase starts, not now.

---

## 14. Glossary

- **ALPR / LPR** — Automated License Plate Recognition / License Plate
  Recognition. Interchangeable in US usage.
- **ANPR** — Automatic Number Plate Recognition; UK/international term for
  the same technology.
- **Hotlist** — a list of plates to match against incoming detections,
  generating alerts on a hit. In real systems, often sourced from
  government databases (NCIC, AMBER Alert); in this demo, always
  user-created.
- **VMS** — Video Management System; not part of this demo's scope.
- **Transparency portal** — a public-facing page some real ALPR vendors
  offer, showing aggregate, non-sensitive stats (camera counts, retention
  policy, search volume) for public accountability. `[VISION]` idea, not
  built here.
