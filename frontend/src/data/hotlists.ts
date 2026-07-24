import type { Hotlist } from "../types";

// Every hotlist in this demo is user-created sample data. Per docs/PRD.md
// §7.5, there is no real NCIC/AMBER Alert/government feed anywhere here.
export const initialHotlists: Hotlist[] = [
  {
    id: "hotlist-1",
    name: "Stolen Vehicle Reports",
    description: "Plates reported stolen within the organization's jurisdiction.",
    createdBy: "Alex Admin",
    active: true,
    entries: [
      { id: "entry-1", plateText: "7ABC123", note: "Reported stolen 2026-07-14" },
      { id: "entry-2", plateText: "9XYZ456", note: "Flagged in connection with theft report #4471" },
    ],
  },
  {
    id: "hotlist-2",
    name: "BOLO — Reckless Driving Complaints",
    description: "Plates named in resident-submitted reckless driving complaints.",
    createdBy: "Jamie Investigator",
    active: true,
    entries: [{ id: "entry-3", plateText: "3STU666", note: "Multiple resident complaints, same block" }],
  },
];
