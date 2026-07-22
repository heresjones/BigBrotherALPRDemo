// Mirrors the data model in docs/PRD.md §9 and the GET /records contract in
// .claude/skills/alpr-demo-infra/SKILL.md — keep in sync with the backend
// contract when that gets built. Everything here is still mock/session data;
// there is no persistence yet.

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

export type UserRole = "Admin" | "Investigator" | "Viewer";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface SearchFilters {
  plateText?: string;
  color?: string;
  vehicleType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchLogEntry {
  id: string;
  actorName: string;
  filters: SearchFilters;
  reason?: string;
  resultCount: number;
  performedAt: string;
}

export interface HotlistEntry {
  id: string;
  plateText: string;
  note?: string;
}

export interface Hotlist {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  active: boolean;
  entries: HotlistEntry[];
}

export type AlertStatus = "new" | "reviewed" | "dismissed";

export interface AlertItem {
  id: string;
  recordId: string;
  hotlistId: string;
  matchedPlateText: string;
  status: AlertStatus;
  reviewedBy?: string;
  reviewNote?: string;
  createdAt: string;
}

export interface Investigation {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  notes: string;
  recordIds: string[];
}

export type AuditActionType =
  | "search"
  | "alert_review"
  | "user_change"
  | "settings_change"
  | "investigation_change";

export interface AuditLogEntry {
  id: string;
  actorName: string;
  actionType: AuditActionType;
  detail: string;
  occurredAt: string;
}

export interface OrgSettings {
  name: string;
  retentionDays: number;
  apiKeyLast4: string;
  apiKeyRotatedAt: string;
}
