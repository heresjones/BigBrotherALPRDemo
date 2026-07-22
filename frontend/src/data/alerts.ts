import type { AlertItem } from "../types";

export const initialAlerts: AlertItem[] = [
  {
    id: "alert-1",
    recordId: "mock-1",
    hotlistId: "hotlist-1",
    matchedPlateText: "7ABC123",
    status: "reviewed",
    reviewedBy: "Alex Admin",
    reviewNote: "Confirmed false positive — vehicle sold prior to the report being filed.",
    createdAt: "2026-07-15T14:33:00Z",
  },
  {
    id: "alert-2",
    recordId: "mock-2",
    hotlistId: "hotlist-1",
    matchedPlateText: "9XYZ456",
    status: "dismissed",
    reviewedBy: "Jamie Investigator",
    reviewNote: "Vehicle description does not match the report on file.",
    createdAt: "2026-07-16T09:11:00Z",
  },
  {
    id: "alert-3",
    recordId: "mock-9",
    hotlistId: "hotlist-1",
    matchedPlateText: "7ABC123",
    status: "new",
    createdAt: "2026-07-20T07:53:00Z",
  },
  {
    id: "alert-4",
    recordId: "mock-12",
    hotlistId: "hotlist-1",
    matchedPlateText: "9XYZ456",
    status: "new",
    createdAt: "2026-07-22T08:48:00Z",
  },
];
