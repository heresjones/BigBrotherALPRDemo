import { useMemo } from "react";
import { useAppData } from "../context/AppDataContext";
import { PageHeader, PageContent } from "../components/Page";
import { formatTimestamp } from "../utils/format";
import type { AuditActionType } from "../types";

const ACTION_META: Record<AuditActionType, { label: string; icon: string; variant: string }> = {
  search: { label: "Search", icon: "search", variant: "primary" },
  alert_review: { label: "Alert review", icon: "bell-fill", variant: "warning" },
  user_change: { label: "User change", icon: "person-fill", variant: "secondary" },
  settings_change: { label: "Settings change", icon: "gear-fill", variant: "secondary" },
  investigation_change: { label: "Investigation change", icon: "folder2-open", variant: "info" },
};

export default function InsightsAuditPage() {
  const { auditLog } = useAppData();

  const searchesByUser = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of auditLog) {
      if (entry.actionType === "search") counts[entry.actorName] = (counts[entry.actorName] ?? 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [auditLog]);

  return (
    <>
      <PageHeader
        title="Insights & Audit"
        lead="Every search and alert disposition, attributed and timestamped. Read-only — nobody, including Admins, can edit or delete an entry."
      />
      <PageContent>
        {searchesByUser.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-4">
            {searchesByUser.map(([name, count]) => (
              <span key={name} className="badge text-bg-light border fs-6 fw-normal py-2 px-3">
                <i className="bi bi-person-fill me-1"></i>
                {name} — {count} search{count === 1 ? "" : "es"}
              </span>
            ))}
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Audit log</h3>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Detail</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((entry) => {
                    const meta = ACTION_META[entry.actionType];
                    return (
                      <tr key={entry.id}>
                        <td className="text-nowrap">{entry.actorName}</td>
                        <td className="text-nowrap">
                          <span className={`badge text-bg-${meta.variant}`}>
                            <i className={`bi bi-${meta.icon} me-1`}></i>
                            {meta.label}
                          </span>
                        </td>
                        <td>{entry.detail}</td>
                        <td className="text-nowrap text-body-secondary">{formatTimestamp(entry.occurredAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}
