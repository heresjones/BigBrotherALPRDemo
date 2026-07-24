import { useMemo } from "react";
import { useAppData } from "../context/AppDataContext";
import { SmallBox } from "../components/SmallBox";
import { Sparkline, MiniDonut, RadialGauge, MiniBars } from "../components/MiniCharts";
import { RecordCard } from "../components/RecordCard";
import { PageHeader, PageContent } from "../components/Page";
import { formatCompact } from "../utils/format";

export default function OverviewPage() {
  const { records, alerts, searchLog, hotlists } = useAppData();

  const trend = useMemo(() => {
    const days: Record<string, number> = {};
    for (const r of records) {
      const day = r.capturedAt.slice(0, 10);
      days[day] = (days[day] ?? 0) + 1;
    }
    return Object.keys(days)
      .sort()
      .map((day) => days[day]);
  }, [records]);

  const searchesPerformed = searchLog.length;
  const searchesWithReason = searchLog.filter((s) => s.reason && s.reason.trim().length > 0).length;
  const reasonPercent = searchesPerformed > 0 ? (searchesWithReason / searchesPerformed) * 100 : 0;

  const activeAlerts = alerts.filter((a) => a.status === "new").length;
  const unreviewedPercent = alerts.length > 0 ? (activeAlerts / alerts.length) * 100 : 0;

  const hotlistEntryCount = hotlists.reduce((sum, h) => sum + h.entries.length, 0);
  const hotlistBars = hotlists.map((h) => ({ label: h.name, value: h.entries.length }));

  const recentRecords = [...records].sort((a, b) => b.capturedAt.localeCompare(a.capturedAt)).slice(0, 4);

  return (
    <>
      <PageHeader title="Overview" lead="Organization-wide snapshot." />
      <PageContent>
        <div className="row">
          <SmallBox
            value={formatCompact(records.length)}
            label="Total records"
            icon="camera-fill"
            variant="primary"
            to="/search"
            linkText="Search records"
            chart={<Sparkline values={trend} title={`Records captured per day over the last ${trend.length} days`} />}
          />
          <SmallBox
            value={formatCompact(searchesPerformed)}
            label="Searches performed"
            icon="search"
            variant="secondary"
            to="/search"
            linkText="View search log"
            chart={
              <MiniDonut
                percent={reasonPercent}
                title={`${searchesWithReason} of ${searchesPerformed} searches included a reason`}
              />
            }
          />
          <SmallBox
            value={formatCompact(activeAlerts)}
            label="Active alerts"
            icon="bell-fill"
            variant="warning"
            to="/alerts"
            linkText="Review alerts"
            chart={
              <RadialGauge
                percent={unreviewedPercent}
                title={`${activeAlerts} of ${alerts.length} alerts are still unreviewed`}
              />
            }
          />
          <SmallBox
            value={formatCompact(hotlistEntryCount)}
            label="Hotlist entries"
            icon="list-ul"
            variant="success"
            to="/alerts"
            linkText="View hotlists"
            chart={<MiniBars items={hotlistBars} />}
          />
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
