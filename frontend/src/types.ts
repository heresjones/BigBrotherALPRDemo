// Mirrors the GET /records response shape from
// .claude/skills/alpr-demo-infra/SKILL.md — keep in sync with the backend
// contract when that gets built.
export interface AlprRecord {
  recordId: string;
  plateText: string | null;
  plateConfidence: number | null;
  vehicleType: string | null;
  vehicleColor: string | null;
  vehicleMakeModel: null;
  imageUrl: string;
  capturedAt: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}
