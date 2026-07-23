import { useMemo } from "react";
import { useAppData } from "../context/AppDataContext";
import { SmallBox } from "../components/SmallBox";
import { RecordCard } from "../components/RecordCard";
import { PageHeader, PageContent } from "../components/Page";
import { formatCompact, formatDate } from "../utils/format";

export default function OverviewPage() {
  const { records, alerts, auditLog, hotlists } = useAppData();

  const trend = useMemo(() => {
    const days: Record<string, number> = {};
    for (const r of records) {
      const day = r.capturedAt.slice(0, 10);
      days[day] = (days[day] ?? 0) + 1;
    }
    return Object.keys(days)
      .sort()
      .map((day) => ({ day, count: days[day] }));
  }, [records]);

  const searchesPerformed = auditLog.filter((a) => a.actionType === "search").length;
  const activeAlerts = alerts.filter((a) => a.status === "new").length;
  const hotlistEntryCount = hotlists.reduce((sum, h) => sum + h.entries.length, 0);
  const recentRecords = [...records].sort((a, b) => b.capturedAt.localeCompare(a.capturedAt)).slice(0, 4);
  const maxCount = Math.max(...trend.map((t) => t.count), 1);

  return (
    <>
      <PageHeader title="Overview" lead="Organization-wide snapshot." />
      <PageContent>
        <div className="row">
          <SmallBox value={formatCompact(records.length)} label="Total records" icon="camera-fill" variant="primary" to="/search" />
          <SmallBox value={formatCompact(searchesPerformed)} label="Searches performed" icon="search" variant="secondary" to="/search" />
          <SmallBox value={formatCompact(activeAlerts)} label="Active alerts" icon="bell-fill" variant="warning" to="/alerts" />
          <SmallBox value={formatCompact(hotlistEntryCount)} label="Hotlist entries" icon="list-ul" variant="success" to="/alerts" />
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">Records captured — last {trend.length} days</h3>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-end gap-2" style={{ height: 120 }}>
                  {trend.map((t) => (
                    <div key={t.day} className="d-flex flex-column align-items-center flex-fill" title={`${t.day}: ${t.count}`}>
                      <div
                        className="bg-primary rounded-top w-100"
                        style={{ height: `${Math.max((t.count / maxCount) * 90, 6)}px` }}
                      ></div>
                      <small className="text-body-secondary mt-1" style={{ fontSize: "0.65rem" }}>
                        {formatDate(t.day).split(",")[0]}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="fs-5 mb-3">Recent records</h3>
        <div className="row">
          {recentRecords.map((r) => (
            <RecordCard key={r.recordId} record={r} />
          ))}
        </div>
      </PageContent>
    </>
  );
}
