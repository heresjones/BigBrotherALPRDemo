import { useMemo } from "react";
import { useAppData } from "../context/AppDataContext";
import { formatTimestamp } from "../utils/format";
import type { AuditActionType } from "../types";

const ACTION_LABELS: Record<AuditActionType, string> = {
  search: "Search",
  alert_review: "Alert review",
  user_change: "User change",
  settings_change: "Settings change",
  investigation_change: "Investigation change",
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
    <div>
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Insights &amp; Audit</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Every search and alert disposition, attributed and timestamped. This log is read-only — nobody, including
        Admins, can edit or delete an entry.
      </p>

      {searchesByUser.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {searchesByUser.map(([name, count]) => (
            <div key={name} className="rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] px-3 py-2 text-sm">
              <span className="font-medium text-[var(--text-primary)]">{name}</span>{" "}
              <span className="text-[var(--text-muted)]">
                — {count} search{count === 1 ? "" : "es"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)]">
              <th className="px-3 py-2 font-medium">Actor</th>
              <th className="px-3 py-2 font-medium">Action</th>
              <th className="px-3 py-2 font-medium">Detail</th>
              <th className="px-3 py-2 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((entry) => (
              <tr key={entry.id} className="border-b border-[var(--border-hairline)] last:border-0 align-top">
                <td className="px-3 py-2 whitespace-nowrap text-[var(--text-primary)]">{entry.actorName}</td>
                <td className="px-3 py-2 whitespace-nowrap text-[var(--text-secondary)]">{ACTION_LABELS[entry.actionType]}</td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">{entry.detail}</td>
                <td className="px-3 py-2 whitespace-nowrap text-[var(--text-muted)]">{formatTimestamp(entry.occurredAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
