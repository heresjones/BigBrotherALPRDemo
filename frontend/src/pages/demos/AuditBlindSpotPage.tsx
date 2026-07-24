import { useState } from "react";
import { ScenarioPage } from "../../components/ScenarioUI";

interface SimSearch {
  id: number;
  day: number;
  plate: string;
  offHours: boolean;
  jurisdictionMismatch: boolean;
}

const SEARCHES: SimSearch[] = [
  { id: 1, day: 1, plate: "3STU666", offHours: false, jurisdictionMismatch: false },
  { id: 2, day: 2, plate: "9XYZ456", offHours: true, jurisdictionMismatch: false },
  { id: 3, day: 2, plate: "9XYZ456", offHours: true, jurisdictionMismatch: false },
  { id: 4, day: 3, plate: "2DEF901", offHours: false, jurisdictionMismatch: true },
  { id: 5, day: 4, plate: "9XYZ456", offHours: false, jurisdictionMismatch: false },
  { id: 6, day: 5, plate: "7ABC123", offHours: true, jurisdictionMismatch: false },
  { id: 7, day: 6, plate: "9XYZ456", offHours: true, jurisdictionMismatch: true },
  { id: 8, day: 7, plate: "6PQR555", offHours: false, jurisdictionMismatch: false },
  { id: 9, day: 8, plate: "9XYZ456", offHours: true, jurisdictionMismatch: false },
  { id: 10, day: 9, plate: "4GHI222", offHours: false, jurisdictionMismatch: true },
  { id: 11, day: 10, plate: "9XYZ456", offHours: true, jurisdictionMismatch: false },
  { id: 12, day: 11, plate: "8JKL333", offHours: false, jurisdictionMismatch: false },
  { id: 13, day: 12, plate: "1MNO444", offHours: true, jurisdictionMismatch: false },
  { id: 14, day: 13, plate: "9XYZ456", offHours: true, jurisdictionMismatch: true },
];

function flagsFor(s: SimSearch, plateCount: number): string[] {
  const flags: string[] = ["Missing case number"];
  if (plateCount > 3) flags.push("Repeated-plate pattern");
  if (s.offHours) flags.push("Off-hours search");
  if (s.jurisdictionMismatch) flags.push("Outside assigned jurisdiction");
  return flags;
}

export default function AuditBlindSpotPage() {
  const [simulated, setSimulated] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [oversightEnabled, setOversightEnabled] = useState(false);

  const plateCounts = SEARCHES.reduce<Record<string, number>>((acc, s) => {
    acc[s.plate] = (acc[s.plate] ?? 0) + 1;
    return acc;
  }, {});

  const totalFlags = SEARCHES.reduce((sum, s) => sum + flagsFor(s, plateCounts[s.plate]).length, 0);

  return (
    <ScenarioPage slug="audit-blind-spot" revealed={oversightEnabled}>
      <div className="card mb-4">
        <div className="card-body">
          <p>One user, no case numbers, over two weeks — every search legally logged, none of it reviewed as it happened.</p>
          {!simulated && (
            <button className="btn btn-primary" onClick={() => setSimulated(true)}>
              <i className="bi bi-play-fill me-1"></i>
              Simulate 14 searches
            </button>
          )}
        </div>
      </div>

      {simulated && (
        <>
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Search log — Officer R. Kessler</h3>
            </div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Plate</th>
                    <th>Case number</th>
                    <th>{oversightEnabled ? "Flags (real time)" : "Flagged in real time?"}</th>
                  </tr>
                </thead>
                <tbody>
                  {SEARCHES.map((s) => (
                    <tr key={s.id}>
                      <td>Day {s.day}</td>
                      <td className="font-monospace">{s.plate}</td>
                      <td className="text-body-secondary">—</td>
                      <td>
                        {oversightEnabled ? (
                          <div className="d-flex flex-wrap gap-1">
                            {flagsFor(s, plateCounts[s.plate]).map((f) => (
                              <span key={f} className="badge text-bg-warning">
                                {f}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-body-secondary">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!oversightEnabled && (
            <>
              {!advanced ? (
                <button className="btn btn-dark mb-4" onClick={() => setAdvanced(true)}>
                  Advance 60 days
                </button>
              ) : (
                <div className="alert alert-danger mb-4">
                  <i className="bi bi-megaphone-fill me-2"></i>
                  Day 60: a supervisor finally notices the pattern — but only after an unrelated complaint.
                </div>
              )}
              {advanced && (
                <button className="btn btn-success mb-4" onClick={() => setOversightEnabled(true)}>
                  <i className="bi bi-shield-check me-1"></i>
                  Enable preventive oversight and re-run
                </button>
              )}
            </>
          )}

          {oversightEnabled && (
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {totalFlags} flags generated in real time across {SEARCHES.length} searches. With missing-case-number
              alerts, unusual-volume detection, repeated-plate detection, jurisdiction-mismatch detection, and
              monthly review certification enabled, this pattern would have surfaced on day 2 — not day 60.
              {totalFlags >= 20 && (
                <div className="mt-2">
                  <strong>Access automatically suspended pending review.</strong>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </ScenarioPage>
  );
}
