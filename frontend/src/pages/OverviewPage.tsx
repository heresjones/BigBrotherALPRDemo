import { useMemo } from "react";
import { useAppData } from "../context/AppDataContext";
import { StatTile } from "../components/StatTile";
import { RecordCard } from "../components/RecordCard";
import { formatCompact } from "../utils/format";

export default function OverviewPage() {
  const { records, alerts, auditLog, hotlists } = useAppData();

  const recordsTrend = useMemo(() => {
    const days: Record<string, number> = {};
    for (const r of records) {
      const day = r.capturedAt.slice(0, 10);
      days[day] = (days[day] ?? 0) + 1;
    }
    return Object.keys(days)
      .sort()
      .map((d) => days[d]);
  }, [records]);

  const searchesPerformed = auditLog.filter((a) => a.actionType === "search").length;
  const activeAlerts = alerts.filter((a) => a.status === "new").length;
  const hotlistEntryCount = hotlists.reduce((sum, h) => sum + h.entries.length, 0);
  const recentRecords = [...records].sort((a, b) => b.capturedAt.localeCompare(a.capturedAt)).slice(0, 4);

  return (
    <div>
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Overview</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Organization-wide snapshot.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total records" value={formatCompact(records.length)} trend={recordsTrend} />
        <StatTile label="Searches performed" value={formatCompact(searchesPerformed)} />
        <StatTile
          label="Active alerts"
          value={formatCompact(activeAlerts)}
          delta={
            activeAlerts > 0
              ? { text: `${activeAlerts} awaiting review`, direction: "up", goodDirection: "down" }
              : undefined
          }
        />
        <StatTile label="Hotlist entries" value={formatCompact(hotlistEntryCount)} />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-[var(--text-primary)]">Recent records</h2>
      <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {recentRecords.map((r) => (
          <RecordCard key={r.recordId} record={r} />
        ))}
      </div>
    </div>
  );
}
