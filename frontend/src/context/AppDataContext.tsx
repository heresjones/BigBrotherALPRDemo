import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { mockRecords } from "../data/records";
import { cameras } from "../data/cameras";
import { initialUsers } from "../data/users";
import { initialHotlists } from "../data/hotlists";
import { initialAlerts } from "../data/alerts";
import { initialInvestigations } from "../data/investigations";
import { initialAuditLog } from "../data/auditLog";
import { initialSearchLog } from "../data/searchLog";
import { initialOrgSettings } from "../data/org";
import { detectDeviations, scoreThreshold, type DeviationCandidate } from "../utils/deviations";
import type {
  AlertItem,
  AlertStatus,
  AlprRecord,
  AppUser,
  AuditActionType,
  Camera,
  Hotlist,
  Investigation,
  OrgSettings,
  SearchFilters,
  SearchLogEntry,
} from "../types";

function nextId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

interface AppDataValue {
  records: AlprRecord[];
  cameras: Camera[];
  users: AppUser[];
  hotlists: Hotlist[];
  alerts: AlertItem[];
  investigations: Investigation[];
  auditLog: import("../types").AuditLogEntry[];
  orgSettings: OrgSettings;
  searchLog: SearchLogEntry[];
  currentUser: AppUser;
  setCurrentUserId: (id: string) => void;

  deviationSensitivity: number;
  setDeviationSensitivity: (value: number) => void;
  deviationWatchlist: Record<string, boolean>;
  toggleDeviationWatch: (plateText: string) => void;
  deviationsByPlate: Record<string, DeviationCandidate[]>;
  activeDeviationPlates: Set<string>;

  logSearch: (filters: SearchFilters, reason: string | undefined, resultCount: number) => void;
  reviewAlert: (alertId: string, status: AlertStatus, note?: string) => void;
  createHotlist: (name: string, description: string, plates: string[]) => void;
  createInvestigation: (name: string, notes: string) => Investigation;
  addRecordToInvestigation: (investigationId: string, recordId: string) => void;
  toggleUserActive: (userId: string) => void;
  updateOrgSettings: (patch: Partial<Pick<OrgSettings, "name" | "retentionDays">>) => void;
  rotateApiKey: () => void;
}

const AppDataContext = createContext<AppDataValue | null>(null);

function addAuditEntryTo(
  log: import("../types").AuditLogEntry[],
  actorName: string,
  actionType: AuditActionType,
  detail: string,
): import("../types").AuditLogEntry[] {
  return [
    { id: nextId("audit"), actorName, actionType, detail, occurredAt: new Date().toISOString() },
    ...log,
  ];
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [records] = useState<AlprRecord[]>(mockRecords);
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [hotlists, setHotlists] = useState<Hotlist[]>(initialHotlists);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [investigations, setInvestigations] = useState<Investigation[]>(initialInvestigations);
  const [auditLog, setAuditLog] = useState(initialAuditLog);
  const [orgSettings, setOrgSettings] = useState<OrgSettings>(initialOrgSettings);
  const [searchLog, setSearchLog] = useState<SearchLogEntry[]>(initialSearchLog);
  const [currentUserId, setCurrentUserId] = useState<string>(initialUsers[1].id);
  const [deviationSensitivity, setDeviationSensitivityState] = useState(55);
  const [deviationWatchlist, setDeviationWatchlist] = useState<Record<string, boolean>>(() => {
    const plates = new Set(records.map((r) => r.plateText).filter((p): p is string => p !== null));
    return Object.fromEntries([...plates].map((p) => [p, true]));
  });

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? users[0],
    [users, currentUserId],
  );

  const deviationsByPlate = useMemo(() => {
    const byPlate: Record<string, AlprRecord[]> = {};
    for (const r of records) {
      if (!r.plateText) continue;
      (byPlate[r.plateText] ??= []).push(r);
    }
    const result: Record<string, DeviationCandidate[]> = {};
    for (const [plate, plateRecords] of Object.entries(byPlate)) {
      const candidates = detectDeviations(plateRecords, cameras);
      if (candidates.length > 0) result[plate] = candidates;
    }
    return result;
  }, [records]);

  const activeDeviationPlates = useMemo(() => {
    const threshold = scoreThreshold(deviationSensitivity);
    const plates = new Set<string>();
    for (const [plate, candidates] of Object.entries(deviationsByPlate)) {
      if (deviationWatchlist[plate] === false) continue;
      if (candidates.some((c) => c.score >= threshold)) plates.add(plate);
    }
    return plates;
  }, [deviationsByPlate, deviationWatchlist, deviationSensitivity]);

  const value: AppDataValue = {
    records,
    cameras,
    users,
    hotlists,
    alerts,
    investigations,
    auditLog,
    orgSettings,
    searchLog,
    currentUser,
    setCurrentUserId,

    deviationSensitivity,
    deviationWatchlist,
    deviationsByPlate,
    activeDeviationPlates,

    setDeviationSensitivity(nextValue) {
      setDeviationSensitivityState(nextValue);
      setAuditLog((prev) =>
        addAuditEntryTo(prev, currentUser.name, "settings_change", `Set deviation alert sensitivity to ${nextValue}`),
      );
    },

    toggleDeviationWatch(plateText) {
      const nextEnabled = deviationWatchlist[plateText] === false;
      setDeviationWatchlist((prev) => ({ ...prev, [plateText]: nextEnabled }));
      setAuditLog((prev) =>
        addAuditEntryTo(
          prev,
          currentUser.name,
          "settings_change",
          `${nextEnabled ? "Enabled" : "Disabled"} deviation alerts for plate ${plateText}`,
        ),
      );
    },

    logSearch(filters, reason, resultCount) {
      const entry: SearchLogEntry = {
        id: nextId("search"),
        actorName: currentUser.name,
        filters,
        reason,
        resultCount,
        performedAt: new Date().toISOString(),
      };
      setSearchLog((prev) => [entry, ...prev]);
      const parts = [
        filters.plateText ? `plate "${filters.plateText}"` : null,
        filters.color ? `color ${filters.color}` : null,
        filters.vehicleType ? `type ${filters.vehicleType}` : null,
        filters.dateFrom || filters.dateTo ? `date range ${filters.dateFrom ?? "…"}–${filters.dateTo ?? "…"}` : null,
      ].filter(Boolean);
      const summary = parts.length > 0 ? parts.join(", ") : "no filters";
      const reasonSuffix = reason ? ` — reason: ${reason}` : "";
      setAuditLog((prev) =>
        addAuditEntryTo(prev, currentUser.name, "search", `Searched ${summary} (${resultCount} results)${reasonSuffix}`),
      );
    },

    reviewAlert(alertId, status, note) {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? { ...a, status, reviewedBy: currentUser.name, reviewNote: note }
            : a,
        ),
      );
      const alert = alerts.find((a) => a.id === alertId);
      setAuditLog((prev) =>
        addAuditEntryTo(
          prev,
          currentUser.name,
          "alert_review",
          `Marked alert on plate ${alert?.matchedPlateText ?? alertId} as ${status}${note ? ` — ${note}` : ""}`,
        ),
      );
    },

    createHotlist(name, description, plates) {
      const hotlist: Hotlist = {
        id: nextId("hotlist"),
        name,
        description,
        createdBy: currentUser.name,
        active: true,
        entries: plates.map((plateText) => ({ id: nextId("entry"), plateText })),
      };
      setHotlists((prev) => [hotlist, ...prev]);
      setAuditLog((prev) => addAuditEntryTo(prev, currentUser.name, "settings_change", `Created hotlist "${name}"`));
    },

    createInvestigation(name, notes) {
      const investigation: Investigation = {
        id: nextId("inv"),
        name,
        createdBy: currentUser.name,
        createdAt: new Date().toISOString(),
        notes,
        recordIds: [],
      };
      setInvestigations((prev) => [investigation, ...prev]);
      setAuditLog((prev) =>
        addAuditEntryTo(prev, currentUser.name, "investigation_change", `Created investigation "${name}"`),
      );
      return investigation;
    },

    addRecordToInvestigation(investigationId, recordId) {
      setInvestigations((prev) =>
        prev.map((inv) =>
          inv.id === investigationId && !inv.recordIds.includes(recordId)
            ? { ...inv, recordIds: [...inv.recordIds, recordId] }
            : inv,
        ),
      );
      const inv = investigations.find((i) => i.id === investigationId);
      setAuditLog((prev) =>
        addAuditEntryTo(
          prev,
          currentUser.name,
          "investigation_change",
          `Attached record ${recordId} to investigation "${inv?.name ?? investigationId}"`,
        ),
      );
    },

    toggleUserActive(userId) {
      const user = users.find((u) => u.id === userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u)));
      setAuditLog((prev) =>
        addAuditEntryTo(
          prev,
          currentUser.name,
          "user_change",
          `${user?.active ? "Deactivated" : "Reactivated"} user ${user?.name ?? userId}`,
        ),
      );
    },

    updateOrgSettings(patch) {
      setOrgSettings((prev) => ({ ...prev, ...patch }));
      setAuditLog((prev) => addAuditEntryTo(prev, currentUser.name, "settings_change", "Updated organization settings"));
    },

    rotateApiKey() {
      const newLast4 = Math.random().toString(16).slice(2, 6);
      setOrgSettings((prev) => ({ ...prev, apiKeyLast4: newLast4, apiKeyRotatedAt: new Date().toISOString() }));
      setAuditLog((prev) => addAuditEntryTo(prev, currentUser.name, "settings_change", "Rotated the shared API key"));
    },
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
