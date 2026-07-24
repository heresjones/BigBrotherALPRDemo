import { useState } from "react";
import { ScenarioPage } from "../../components/ScenarioUI";
import { ClaimBadge } from "../../components/ClaimBadge";
import { VehiclePhoto } from "../../components/VehiclePhoto";

const PLATE = "DEMO-427";

interface Detection {
  day: number;
  camera: string;
  location: string;
  locationType: string;
  sensitive: boolean;
}

const DETECTIONS: Detection[] = [
  { day: 1, camera: "Cam 1", location: "Elm St Grocery — parking lot", locationType: "Routine errand", sensitive: false },
  { day: 2, camera: "Cam 4", location: "Riverside Medical Clinic", locationType: "Medical clinic", sensitive: true },
  { day: 3, camera: "Cam 2", location: "Maple Ave — primary residence", locationType: "Residence", sensitive: false },
  { day: 5, camera: "Cam 6", location: "St. Andrew's Church lot", locationType: "Religious institution", sensitive: true },
  { day: 6, camera: "Cam 3", location: "Harbor Logistics", locationType: "Workplace", sensitive: false },
  { day: 8, camera: "Cam 1", location: "Elm St Grocery — parking lot", locationType: "Routine errand", sensitive: false },
  { day: 9, camera: "Cam 7", location: "Fairview Community Center — Ward 4 meeting", locationType: "Political meeting", sensitive: true },
  { day: 11, camera: "Cam 8", location: "Birchwood Apartments", locationType: "Second residence", sensitive: true },
  { day: 13, camera: "Cam 3", location: "Harbor Logistics", locationType: "Workplace", sensitive: false },
];

const INFERENCES = [
  "Visits a medical clinic roughly weekly.",
  "Regularly present at a workplace distinct from the primary residence — Harbor Logistics.",
  "May maintain a second residence at Birchwood Apartments.",
  "Attended a political meeting at Fairview Community Center on day 9.",
  "Associated with a religious institution — St. Andrew's Church.",
];

export default function TravelHistoryPage() {
  const [step, setStep] = useState(0);
  const singleDetection = DETECTIONS[0];

  return (
    <ScenarioPage slug="travel-history" revealed={step >= 2}>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <VehiclePhoto src="/vehicle-photos/blue-sedan.jpg" plateText={PLATE} alt={PLATE} />
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="font-monospace-lg">{PLATE}</span>
                <ClaimBadge level="observed" />
              </div>
              <p className="mb-1">
                <strong>Day {singleDetection.day}</strong> — {singleDetection.location}
              </p>
              <p className="text-body-secondary small mb-0">
                A single, unremarkable detection: a grocery-store run on {singleDetection.camera}.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <p>
                On its own, this detection reveals almost nothing. It's one camera, one moment, one ordinary trip.
              </p>
              {step === 0 && (
                <button className="btn btn-primary" onClick={() => setStep(1)}>
                  <i className="bi bi-search me-1"></i>
                  Expand search to 8 connected cameras
                </button>
              )}
              {step >= 1 && (
                <div className="alert alert-warning mb-0">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Search expanded to 8 cameras across a 14-day window — {DETECTIONS.length} detections found for{" "}
                  {PLATE}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {step >= 1 && (
        <>
          <h3 className="fs-5 mb-3">14-day detection timeline</h3>
          <div className="card mb-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Camera</th>
                      <th>Location</th>
                      <th>Location type</th>
                      <th>Claim</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DETECTIONS.map((d) => (
                      <tr key={`${d.day}-${d.camera}`}>
                        <td>Day {d.day}</td>
                        <td>{d.camera}</td>
                        <td>{d.location}</td>
                        <td>
                          <span className={`badge ${d.sensitive ? "text-bg-danger" : "text-bg-secondary"}`}>
                            {d.locationType}
                          </span>
                        </td>
                        <td>
                          <ClaimBadge level="observed" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-end gap-2 mb-4" style={{ height: 90 }}>
            {DETECTIONS.map((d) => (
              <div key={`bar-${d.day}`} className="d-flex flex-column align-items-center flex-fill" title={d.location}>
                <div
                  className={`rounded-top w-100 ${d.sensitive ? "bg-danger" : "bg-secondary"}`}
                  style={{ height: 50 }}
                ></div>
                <small className="text-body-secondary mt-1" style={{ fontSize: "0.65rem" }}>
                  D{d.day}
                </small>
              </div>
            ))}
          </div>

          {step === 1 && (
            <button className="btn btn-dark mb-4" onClick={() => setStep(2)}>
              <i className="bi bi-diagram-3-fill me-1"></i>
              Generate inferred routine panel
            </button>
          )}
        </>
      )}

      {step >= 2 && (
        <div className="card border-dark mb-4">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h3 className="card-title">Inferred routine</h3>
            <ClaimBadge level="inferred" />
          </div>
          <div className="card-body">
            <ul className="mb-3">
              {INFERENCES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="alert alert-secondary mb-0">
              <i className="bi bi-exclamation-triangle me-2"></i>
              This panel is <strong>potentially misleading</strong>. A vehicle observed near a location does not
              prove why the person was there, who was driving, or that the visits are connected.
            </div>
          </div>
        </div>
      )}
    </ScenarioPage>
  );
}
