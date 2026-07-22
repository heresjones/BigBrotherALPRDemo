import type { AlprRecord } from "./types";

// Local SVG data URI so the dashboard renders something photo-shaped with
// zero network dependency — there's no backend/S3 to fetch real images from yet.
function placeholderImage(color: string, plate: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">
      <rect width="320" height="200" fill="${color}" />
      <rect x="90" y="150" width="140" height="34" rx="4" fill="#fff" />
      <text x="160" y="174" font-family="monospace" font-size="20" font-weight="bold"
            text-anchor="middle" fill="#111">${plate}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const mockRecords: AlprRecord[] = [
  {
    recordId: "mock-1",
    plateText: "7ABC123",
    plateConfidence: 0.94,
    vehicleType: "Sedan",
    vehicleColor: "Blue",
    vehicleMakeModel: null,
    imageUrl: placeholderImage("#3b5bdb", "7ABC123"),
    capturedAt: "2026-07-20T14:32:00Z",
    latitude: 34.0522,
    longitude: -118.2437,
    createdAt: "2026-07-20T14:32:05Z",
  },
  {
    recordId: "mock-2",
    plateText: "9XYZ456",
    plateConfidence: 0.88,
    vehicleType: "Pickup Truck",
    vehicleColor: "Red",
    vehicleMakeModel: null,
    imageUrl: placeholderImage("#c92a2a", "9XYZ456"),
    capturedAt: "2026-07-20T15:10:00Z",
    latitude: 34.0407,
    longitude: -118.2468,
    createdAt: "2026-07-20T15:10:04Z",
  },
  {
    recordId: "mock-3",
    plateText: "KLM789",
    plateConfidence: 0.76,
    vehicleType: "SUV",
    vehicleColor: "Black",
    vehicleMakeModel: null,
    imageUrl: placeholderImage("#343a40", "KLM789"),
    capturedAt: "2026-07-21T09:05:00Z",
    latitude: null,
    longitude: null,
    createdAt: "2026-07-21T09:05:03Z",
  },
  {
    recordId: "mock-4",
    plateText: null,
    plateConfidence: null,
    vehicleType: "Sedan",
    vehicleColor: "White",
    vehicleMakeModel: null,
    imageUrl: placeholderImage("#868e96", "UNREADABLE"),
    capturedAt: "2026-07-21T11:47:00Z",
    latitude: 34.0195,
    longitude: -118.4912,
    createdAt: "2026-07-21T11:47:02Z",
  },
  {
    recordId: "mock-5",
    plateText: "2DEF901",
    plateConfidence: 0.97,
    vehicleType: "Sedan",
    vehicleColor: "Green",
    vehicleMakeModel: null,
    imageUrl: placeholderImage("#2b8a3e", "2DEF901"),
    capturedAt: "2026-07-22T08:15:00Z",
    latitude: 34.0522,
    longitude: -118.2437,
    createdAt: "2026-07-22T08:15:06Z",
  },
];
