# Demo Scenarios — Privacy Scenario Library

**Status:** Implemented (frontend, dummy data, no backend)
**Last updated:** 2026-07-22

---

## 1. Purpose

The rest of this app (`docs/PRD.md`) models BigBrotherALPRDemo as an
operational ALPR SaaS product — the thing an agency would actually run.
This document covers a different, narrower feature built on top of it: the
**Scenario Library**, a set of eleven self-contained, interactive walkthroughs
that make a single point each time —

> The power of ALPR is not in one camera image. It is in joining many
> detections, databases, users, and organizations together.

Each scenario takes an ordinary-looking action and shows it becoming
consequential once the system scales, makes a mistake, or is used by
someone with an improper purpose. Every scenario is built around the same
move: show the plausible/sympathetic version first, then reveal the
mechanism that makes it risky, then (where the source material calls for
it) show the same flow again with a specific, nameable safeguard in place.

All data in every scenario is fictional. Fictional plates
(`DEMO-427`, `DEMO-119`), fictional people (Jordan Lee), fictional
locations, fictional organizations. Nothing here reads from or writes to
the operational mock data used by the rest of the app, with one deliberate
exception noted in §4 (Watchlist abuse), which intentionally reuses the
real audit log to make its point concrete.

Reached from the sidebar under **Scenario Library**, at `/demos` (an index
of all eleven) and `/demos/:slug` for each one.

---

## 2. The claim-level legend

The source material's closing point is the one every screen in this
library has to honor: distinguish what the system actually knows from what
it's guessing. Every scenario tags its key facts with one of four badges,
used consistently across all ten:

| Badge | Meaning | Example |
|---|---|---|
| **Observed** (blue) | A direct capture — a photo exists, a detection happened | "A white sedan was photographed here at 6:42 PM." |
| **Estimated** (cyan) | A model's guess, with a confidence score | "OCR reads the plate as BG-82168, 72% confidence." |
| **Inferred** (dark) | A conclusion computed by combining multiple observations | "This vehicle may visit this location on a weekly routine." |
| **Externally linked** (amber) | A fact pulled from a separate database, not verified by this system | "A registration database associates this plate with Jordan Lee." |

`ClaimBadge` (`frontend/src/components/ClaimBadge.tsx`) implements these
four, fixed, everywhere they're used. A screen that blurs "observed" and
"inferred" together is exactly the failure mode this whole library exists
to make visible — so the badges are treated as required, not decorative.

---

## 3. The eleven scenarios

Each entry below: the public concern it demonstrates, what the app
actually does (route + interaction steps), and the reveal line shown at
the end.

### 3.1 Reconstructing someone's movements — `/demos/travel-history`

**Concern:** Separate public observations become a searchable travel
history.

**Flow:** Starts on a single, harmless detection of fictional plate
`DEMO-427` (a grocery-store parking lot). A "Expand search to 8 connected
cameras" button reveals the full 14-day detection history across 8
cameras, each tagged with a location type — including a medical clinic, a
place of worship, a political meeting, a workplace, and a second
residence. A further "Generate inferred routine panel" button produces an
**Inferred**-tagged routine summary, explicitly captioned that proximity
does not establish purpose.

**Reveal:** *"The camera never followed this person. The database did."*

### 3.2 A false plate match causing a high-risk alert — `/demos/false-match`

**Concern:** One mistaken character can turn an innocent vehicle into a
suspect vehicle.

**Flow:** A detection shows plate `BG-82168` at 72% OCR confidence
(**Estimated**), with hotlisted plate `BQ-82168` (**Externally linked**)
ranked as a close alternative candidate. With "Automatic matching" on by
default, the system fires an urgent alert immediately — then reveals the
vehicle's color/make don't match the hotlist entry at all. A "Replay with
safeguards" panel adds four independently toggleable controls (≥90%
confidence required, compare make/model/color, require human photo
review, confirm hotlist entry still active); with all four on, the same
detection is routed to manual review instead of an automatic alert.

**Reveal:** *"This alert was not evidence. It was a computer's guess that
still needed verification."*

### 3.3 Cross-agency network expansion — `/demos/network-expansion`

**Concern:** A town may approve ten cameras while its users can search
thousands of cameras elsewhere.

**Flow:** Three network levels (Town only → Neighboring agencies →
Statewide), selected with buttons. Four counters update at each level:
cameras owned (fixed at 8), cameras searchable, organizations sharing in,
and outside organizations able to search the town's own cameras. The same
plate search is re-run at each level, and the result count scales with
network size, not with anything the town approved.

**Reveal:** *"The number on the street is not necessarily the size of the
surveillance network."*

### 3.4 Custom watchlist abuse — `/demos/watchlist-abuse`

**Concern:** An authorized user may have a technically valid login but an
improper purpose.

**Flow:** A form creates a watchlist for a fictional target (a journalist,
neighbor, employee, former partner, or political organizer — picked from a
dropdown, never a real person) with **no case-number field at all** in the
unsafe path. Submitting immediately starts generating arrival alerts and
— genuinely, not just illustratively — writes a real entry to this app's
own audit log (`AppDataContext.createHotlist`, visible afterward on
**Insights & Audit**), while nothing in the flow blocks it in real time.
A "Replay with controls" panel adds case number + offense category
(required), supervisor approval for sensitive watchlists, an expiration
date, compliance notification, and a rule that the creator can't
self-approve; re-attempting the unsafe flow with controls on is rejected
with a specific, named reason.

**Reveal:** *"Encryption stops an outsider. It does not stop an authorized
user from making an improper search."*

### 3.5 Sensitive-location searches — `/demos/sensitive-location`

**Concern:** A system can reveal sensitive associations without facial
recognition.

**Flow:** Pick a fictional protected-activity location type (clinic,
protest, union hall, place of worship, immigration-services office) and a
time window — no name or plate required anywhere in the form. Submitting
returns a list of ordinary vehicles observed there, each tagged
**Observed**, no inference needed to make the point. A "Require legal
review for protected-activity locations" policy toggle, when on, replaces
the raw result list with a "Pending legal review" state instead.

**Reveal:** *"You don't need facial recognition to learn something
sensitive about a person."*

### 3.6 Searching by appearance instead of plate — `/demos/appearance-search`

**Concern:** A vague description can turn many innocent vehicles into
investigative candidates.

**Flow:** A description-based search ("Gray SUV, roof rack, rear bumper
damage, 8–10 PM") returns a fixed pool of 18 **Estimated**-tagged
candidates, several deliberately flagged as likely misclassifications
(damage that's actually a shadow, a blue vehicle read as gray, a roof
antenna read as a rack). A Strict/Moderate/Loose filter slider changes how
many of the 18 are shown, demonstrating the recall/precision trade-off
directly — loosening the filter doesn't find better evidence, it just
enlarges the candidate pool.

**Reveal:** *"The search produces leads — not proof. Everyone who
resembles the description enters the candidate pool."*

### 3.7 Registered owner is not necessarily the driver — `/demos/owner-vs-driver`

**Concern:** A correct plate observation can still produce an incorrect
human conclusion.

**Flow:** Plate `DEMO-119` is read correctly (**Observed**, high
confidence — no OCR error anywhere in this one, on purpose). A lookup
against a fictional registration database (**Externally linked**) returns
"Jordan Lee," and the interface initially — wrongly — labels this
"Associated person: Jordan Lee." Revealing one of four fictional
complications (borrowed by a family member, recently sold, a rental, a
stolen plate) shows why that label overstates what's known, and a
"Correct the interface" action changes the label everywhere to "Registered
owner — not confirmed driver."

**Reveal:** *"The camera can identify a vehicle. It cannot establish who
was driving."*

### 3.8 The 30-day deletion loophole — `/demos/deletion-loophole`

**Concern:** Automatic deletion from the live system does not delete
exported copies.

**Flow:** A day-by-day timeline (Day 1 / 8 / 30 / 90 / 365) stepped through
with a "Advance" control. Day 1: detection captured. Day 8: a user
downloads it — a copy now exists outside the live system. Day 30: the
original is deleted per retention policy — and the live-system copy is the
*only* one that disappears. Day 90 and Day 365 confirm the export still
sits in evidence storage and a case file, respectively. The end state is
an explicit count: "Live system: 0 copies. Copies that still exist outside
it: 3."

**Reveal:** *"Retention controls the original database. It cannot
automatically recall every copy that left it."*

### 3.9 Audit logs that nobody reviews — `/demos/audit-blind-spot`

**Concern:** Logging misconduct is different from preventing or detecting
it promptly.

**Flow:** "Simulate 14 searches" populates a table of searches by one
user, all missing a case number, several repeating the same plate,
several off-hours — every one logged, none flagged, because nothing
reviews the log as it's written. An "Advance 60 days" control reveals that
a supervisor only notices after an unrelated complaint. An "Enable
preventive oversight" toggle re-runs the same 14 searches with real-time
flags this time: missing-case-number alerts, unusual-volume detection,
repeated-plate detection, jurisdiction-mismatch detection, and a monthly
certification requirement — the difference between recording something and
catching it.

**Reveal:** *"The system recorded every questionable search perfectly.
Nobody looked."*

### 3.10 Capability creep — `/demos/capability-creep`

**Concern:** A system approved for limited still-image ALPR can acquire
broader capabilities later.

**Flow:** A fixed, locked "Publicly approved configuration" card (still
images, 30-day retention, 8 cameras, local searches only) stays on screen,
unchanged, for the whole scenario. Six independent toggles (recorded
video, live viewing, 365-day retention, regional sharing,
vehicle-description alerts, additional third-party cameras) drive a
second "Current configuration" card that visibly diverges from the first
as each is flipped.

**Reveal:** *"The public debate happened when the system did one thing.
The software changed afterward."*

### 3.11 Searching by identity instead of a plate — `/demos/dark-data-search`

**Concern:** A platform built to search license plates can also search by
SSN, email, IP address, crypto wallet, or messaging handle — collapsing
the line between a vehicle search and a search of a person's whole
digital life.

**Flow:** A search form takes an identifier (email, SSN, IP, crypto
wallet, Discord/Telegram handle, credit card) — no plate anywhere in it.
Two fields are shown already filled in by the system, not the officer:
search radius defaulting to **1,500 miles** (roughly the continental
US), and a reason field defaulting to the placeholder **"Nova
investigation."** Submitting returns results across five unrelated data
categories — vehicle detections (**Observed**), a financial-transaction
reference, an IP-geolocation cluster inferring a home address
(**Inferred**), messaging-platform metadata, and a breach-data
reference (all **Externally linked**) — from one identifier alone. A
"Replay with safeguards" panel adds three controls (require a
case-linked justification instead of the placeholder, cap the default
radius to the local jurisdiction, require supervisor sign-off for
identifier searches beyond vehicle data); with them on, the search is
blocked, scoped down, or routed to approval instead of running as-is.

**Reveal:** *"A search that starts with 'see everything' doesn't need a
plate. It needs an identifier — and a reason field the system already
filled in for you."*

This scenario exists because a viewer fact-check surfaced a specific,
sourced claim (a security researcher's account of a Flock Nova demo,
discussed in a January 2026 Business Reform video) describing exactly
these three mechanisms together — non-plate identifier search, a
default nationwide radius, and an auto-populated reason field — as
distinct from anything the other ten scenarios modeled. See the
verification notes in the conversation that produced this scenario for
what was and wasn't independently confirmed; nothing here asserts the
claims are true of the real product, only that they're a coherent
failure mode worth demonstrating.

---

## 4. Recommended opening series

Per the source material, if introducing this library gradually rather than
all eleven at once, lead with these five — they cover aggregation, accuracy,
sharing, insider misuse, and retention, the five strongest concerns:

1. Travel history (`/demos/travel-history`)
2. False match (`/demos/false-match`)
3. Network expansion (`/demos/network-expansion`)
4. Watchlist abuse (`/demos/watchlist-abuse`)
5. Deletion loophole (`/demos/deletion-loophole`)

---

## 5. Implementation notes

- **Dummy images.** Every vehicle photo in the Scenario Library uses the
  same local SVG placeholder generator as the rest of the app
  (`frontend/src/utils/placeholderImage.ts`) — no network dependency, no
  real photos anywhere.
- **Self-contained by default.** Scenarios 1, 2, 3, 5, 6, 7, 8, 10, 11 run
  entirely on local component state — nothing they do touches the
  operational mock data (`AppDataContext`) used by the rest of the app.
  Scenario 4 (watchlist abuse) is the deliberate exception: it calls the
  real `createHotlist` action so the point ("nothing stops this in real
  time, but it is recorded") is demonstrably true against the same audit
  log the Insights & Audit page reads, not a simulated one. Scenario 9
  (audit blind spot) keeps its own local, simulated log instead of the
  real one, since it needs to fast-forward 60 days and run a
  before/after comparison that doesn't belong mixed into the operational
  audit trail.
- **No new backend surface.** Nothing here changes the API contract in
  `.claude/skills/alpr-demo-infra/SKILL.md` or the data model in
  `docs/PRD.md` §9 — this is a frontend-only narrative layer on top of the
  existing mock app.
- **Not a replacement for the PRD's Insights & Audit page.** This library
  demonstrates failure modes; the operational pages demonstrate the actual
  product surface. Where they overlap (scenario 4's audit trail), that's
  intentional and called out above.
