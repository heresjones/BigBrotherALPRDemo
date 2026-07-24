import type { SearchLogEntry } from "../types";

// Structured mirror of the "search" entries in data/auditLog.ts — kept as
// its own list because SearchFilters/reason need to stay queryable, not
// buried in a free-text detail string. Newest first, matching how live
// searches get prepended.
export const initialSearchLog: SearchLogEntry[] = [
  {
    id: "search-seed-5",
    actorName: "Jamie Investigator",
    filters: { dateFrom: "2026-07-18", dateTo: "2026-07-21" },
    reason: "Weekly patrol area review",
    resultCount: 6,
    performedAt: "2026-07-21T09:15:00Z",
  },
  {
    id: "search-seed-4",
    actorName: "Jamie Investigator",
    filters: { plateText: "7ABC" },
    reason: "Follow-up on theft report #4471",
    resultCount: 2,
    performedAt: "2026-07-20T07:50:00Z",
  },
  {
    id: "search-seed-3",
    actorName: "Sam Viewer",
    filters: { plateText: "9XYZ" },
    resultCount: 2,
    performedAt: "2026-07-18T16:40:00Z",
  },
  {
    id: "search-seed-2",
    actorName: "Jamie Investigator",
    filters: { vehicleType: "Sedan" },
    reason: "Traffic collision follow-up — Elm St",
    resultCount: 4,
    performedAt: "2026-07-17T11:05:00Z",
  },
  {
    id: "search-seed-1",
    actorName: "Alex Admin",
    filters: { color: "Red" },
    resultCount: 3,
    performedAt: "2026-07-16T14:10:00Z",
  },
];
