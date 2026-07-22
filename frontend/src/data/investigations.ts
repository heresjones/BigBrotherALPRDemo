import type { Investigation } from "../types";

export const initialInvestigations: Investigation[] = [
  {
    id: "inv-1",
    name: "Repeated sighting — 7ABC123",
    createdBy: "Jamie Investigator",
    createdAt: "2026-07-20T08:00:00Z",
    notes: "Vehicle observed twice within a week near the same corridor. Watching for a third sighting before escalating.",
    recordIds: ["mock-1", "mock-9"],
  },
  {
    id: "inv-2",
    name: "Reckless driving complaint follow-up",
    createdBy: "Jamie Investigator",
    createdAt: "2026-07-21T13:00:00Z",
    notes: "Following up on resident complaint regarding plate 3STU666.",
    recordIds: ["mock-11"],
  },
];
