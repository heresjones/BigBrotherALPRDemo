import { useState } from "react";
import { ScenarioPage } from "../../components/ScenarioUI";

interface DayEvent {
  day: number;
  label: string;
  description: string;
  addsCopy?: string;
  deletesOriginal?: boolean;
}

const TIMELINE: DayEvent[] = [
  { day: 1, label: "Day 1", description: "Detection captured and stored in the live system." },
  { day: 8, label: "Day 8", description: "A user downloads the image for a report.", addsCopy: "Downloaded report" },
  { day: 30, label: "Day 30", description: "The original detection is deleted per the 30-day retention policy.", deletesOriginal: true },
  { day: 90, label: "Day 90", description: "The export is entered into evidence storage and emailed to a colleague.", addsCopy: "Evidence storage" },
  { day: 365, label: "Day 365", description: "A screenshot of the export still exists in a closed case file.", addsCopy: "Case-management system" },
];

export default function DeletionLoopholePage() {
  const [dayIndex, setDayIndex] = useState(0);
  const current = TIMELINE[dayIndex];

  const copies = new Set<string>();
  let originalExists = true;
  for (let i = 0; i <= dayIndex; i++) {
    if (TIMELINE[i].addsCopy) copies.add(TIMELINE[i].addsCopy as string);
    if (TIMELINE[i].deletesOriginal) originalExists = false;
  }
  // Day 90's event also implies an email copy — track both explicitly once reached.
  if (dayIndex >= 3) copies.add("Email attachment");

  return (
    <ScenarioPage slug="deletion-loophole" revealed={dayIndex === TIMELINE.length - 1}>
      <div className="d-flex justify-content-between mb-2">
        {TIMELINE.map((t, i) => (
          <div key={t.day} className="text-center flex-fill">
            <div
              className={`mx-auto rounded-circle d-flex align-items-center justify-content-center ${
                i <= dayIndex ? "bg-primary text-white" : "bg-secondary-subtle text-body-secondary"
              }`}
              style={{ width: 36, height: 36 }}
            >
              {i + 1}
            </div>
            <small className="d-block mt-1">{t.label}</small>
          </div>
        ))}
      </div>
      <div className="progress mb-4" style={{ height: 4 }}>
        <div
          className="progress-bar"
          style={{ width: `${(dayIndex / (TIMELINE.length - 1)) * 100}%` }}
        ></div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="fs-5">{current.label}</h3>
          <p className="mb-3">{current.description}</p>
          {dayIndex < TIMELINE.length - 1 && (
            <button className="btn btn-primary" onClick={() => setDayIndex((i) => Math.min(i + 1, TIMELINE.length - 1))}>
              Advance <i className="bi bi-arrow-right ms-1"></i>
            </button>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4 h-100">
            <div className="card-header">
              <h3 className="card-title">Live system</h3>
            </div>
            <div className="card-body">
              {originalExists ? (
                <div className="alert alert-primary mb-0">
                  <i className="bi bi-check-circle-fill me-2"></i>1 copy (the original detection)
                </div>
              ) : (
                <div className="alert alert-success mb-0">
                  <i className="bi bi-trash-fill me-2"></i>0 copies — deleted per retention policy
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4 h-100">
            <div className="card-header">
              <h3 className="card-title">Copies outside the live system</h3>
            </div>
            <div className="card-body">
              {copies.size === 0 ? (
                <p className="text-body-secondary mb-0">None yet.</p>
              ) : (
                <ul className="mb-0">
                  {Array.from(copies).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScenarioPage>
  );
}
