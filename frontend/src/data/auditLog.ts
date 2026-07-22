import type { AuditLogEntry } from "../types";

// Seed history predating this session. New entries get prepended by
// AppDataContext as actions happen (searches, alert reviews, etc.) — see
// docs/PRD.md §7.9, FR-9.1-9.3. This log is read-only in the UI by design.
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
    actionType: "user_change",
    detail: "Deactivated user Taylor Investigator",
    occurredAt: "2026-07-18T15:20:00Z",
  },
  {
    id: "audit-4",
    actorName: "Jamie Investigator",
    actionType: "search",
    detail: "Searched plate \"7ABC\" — reason: follow-up on theft report #4471",
    occurredAt: "2026-07-20T07:50:00Z",
  },
];
