import type { AuditLogEntry } from "../types";

// Seed history predating this session. New entries get prepended by
// AppDataContext as actions happen (searches, alert reviews, etc.) — see
// docs/PRD.md §7.9, FR-9.1-9.3. This log is read-only in the UI by design.
// The "search" entries here mirror data/searchLog.ts one-to-one, so the
// Overview KPIs and this log always agree on how many searches happened.
export const initialAuditLog: AuditLogEntry[] = [
  {
    id: "audit-1",
    actorName: "Alex Admin",
    actionType: "settings_change",
    detail: "Created hotlist \"Stolen Vehicle Reports\"",
    occurredAt: "2026-07-14T10:00:00Z",
  },
  {
    id: "audit-2",
    actorName: "Jamie Investigator",
    actionType: "alert_review",
    detail: "Dismissed alert on plate 9XYZ456 — description mismatch",
    occurredAt: "2026-07-16T09:11:00Z",
  },
  {
    id: "audit-3",
    actorName: "Alex Admin",
    actionType: "search",
    detail: "Searched color Red (3 results)",
    occurredAt: "2026-07-16T14:10:00Z",
  },
  {
    id: "audit-4",
    actorName: "Jamie Investigator",
    actionType: "search",
    detail: "Searched type Sedan (4 results) — reason: Traffic collision follow-up — Elm St",
    occurredAt: "2026-07-17T11:05:00Z",
  },
  {
    id: "audit-5",
    actorName: "Alex Admin",
    actionType: "user_change",
    detail: "Deactivated user Taylor Investigator",
    occurredAt: "2026-07-18T15:20:00Z",
  },
  {
    id: "audit-6",
    actorName: "Sam Viewer",
    actionType: "search",
    detail: "Searched plate \"9XYZ\" (2 results)",
    occurredAt: "2026-07-18T16:40:00Z",
  },
  {
    id: "audit-7",
    actorName: "Jamie Investigator",
    actionType: "search",
    detail: "Searched plate \"7ABC\" — reason: follow-up on theft report #4471",
    occurredAt: "2026-07-20T07:50:00Z",
  },
  {
    id: "audit-8",
    actorName: "Jamie Investigator",
    actionType: "search",
    detail: "Searched date range 2026-07-18–2026-07-21 (6 results) — reason: Weekly patrol area review",
    occurredAt: "2026-07-21T09:15:00Z",
  },
];
