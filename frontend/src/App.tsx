import { useMemo, useState } from "react";
import { mockRecords } from "./mockRecords";
import "./App.css";

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString();
}

function formatLocation(lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return "—";
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

function App() {
  const [plateFilter, setPlateFilter] = useState("");

  const records = useMemo(() => {
    const query = plateFilter.trim().toUpperCase();
    if (!query) return mockRecords;
    return mockRecords.filter((record) =>
      record.plateText?.toUpperCase().includes(query),
    );
  }, [plateFilter]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>BigBrotherALPRDemo</h1>
        <p className="subtitle">ALPR record dashboard</p>
      </header>

      <div className="mock-banner">
        Showing mock data — no backend is deployed yet. See{" "}
        <code>.claude/skills/alpr-demo-infra/SKILL.md</code> for the planned
        API contract this UI is built against.
      </div>

      <input
        className="plate-search"
        type="text"
        placeholder="Search by plate…"
        value={plateFilter}
        onChange={(event) => setPlateFilter(event.target.value)}
      />

      <div className="record-grid">
        {records.map((record) => (
          <div className="record-card" key={record.recordId}>
            <img src={record.imageUrl} alt={record.plateText ?? "Unreadable plate"} />
            <div className="record-body">
              <div className="plate-text">
                {record.plateText ?? "Unreadable"}
                {record.plateConfidence !== null && (
                  <span className="confidence">
                    {Math.round(record.plateConfidence * 100)}%
                  </span>
                )}
              </div>
              <dl>
                <dt>Vehicle</dt>
                <dd>
                  {record.vehicleColor ?? "Unknown"} {record.vehicleType ?? "vehicle"}
                </dd>
                <dt>Make/model</dt>
                <dd>Unknown</dd>
                <dt>Captured</dt>
                <dd>{formatTimestamp(record.capturedAt)}</dd>
                <dt>Location</dt>
                <dd>{formatLocation(record.latitude, record.longitude)}</dd>
              </dl>
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <p className="empty-state">No records match "{plateFilter}".</p>
        )}
      </div>
    </div>
  );
}

export default App;
