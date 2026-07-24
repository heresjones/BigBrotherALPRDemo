import { useState } from "react";
import { ScenarioPage } from "../../components/ScenarioUI";
import { ClaimBadge } from "../../components/ClaimBadge";
import { VehiclePhoto } from "../../components/VehiclePhoto";

const PLATE = "DEMO-119";
const OWNER = "Jordan Lee";

const COMPLICATIONS = [
  { id: "borrowed", label: "The vehicle was borrowed by a family member that evening." },
  { id: "sold", label: "The vehicle was sold two weeks before this detection — title hasn't transferred in records yet." },
  { id: "rental", label: "The vehicle is a rental; Jordan Lee returned it three days earlier." },
  { id: "stolen-plate", label: "The plate was reported stolen and placed on a different vehicle entirely." },
];

export default function OwnerVsDriverPage() {
  const [lookedUp, setLookedUp] = useState(false);
  const [complicationId, setComplicationId] = useState<string | null>(null);
  const [corrected, setCorrected] = useState(false);

  const complication = COMPLICATIONS.find((c) => c.id === complicationId);

  return (
    <ScenarioPage slug="owner-vs-driver" revealed={corrected}>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <VehiclePhoto src="/vehicle-photos/silver-suv.jpg" plateText={PLATE} alt={PLATE} />
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="font-monospace-lg">{PLATE}</span>
                <ClaimBadge level="observed" />
              </div>
              <p className="text-body-secondary small mb-0">
                Read correctly, 97% confidence. No OCR error anywhere in this scenario — the plate read is not the
                problem.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              {!lookedUp ? (
                <button className="btn btn-primary" onClick={() => setLookedUp(true)}>
                  <i className="bi bi-search me-1"></i>
                  Look up registered owner
                </button>
              ) : (
                <>
                  {!corrected ? (
                    <div className="alert alert-danger">
                      <div className="fs-5">
                        Associated person: <strong>{OWNER}</strong>
                      </div>
                      <ClaimBadge level="external" />
                    </div>
                  ) : (
                    <div className="alert alert-success">
                      <div className="fs-5">
                        Registered owner — not confirmed driver: <strong>{OWNER}</strong>
                      </div>
                      <ClaimBadge level="external" />
                    </div>
                  )}

                  <p className="mb-2">Reveal a complication:</p>
                  <div className="d-flex flex-column gap-2 mb-3">
                    {COMPLICATIONS.map((c) => (
                      <div className="form-check" key={c.id}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="complication"
                          id={c.id}
                          checked={complicationId === c.id}
                          onChange={() => setComplicationId(c.id)}
                        />
                        <label className="form-check-label" htmlFor={c.id}>
                          {c.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  {complication && (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {complication.label} The registered owner and the driver are not necessarily the same person.
                    </div>
                  )}

                  {complication && !corrected && (
                    <button className="btn btn-dark" onClick={() => setCorrected(true)}>
                      <i className="bi bi-pencil-square me-1"></i>
                      Correct the interface
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScenarioPage>
  );
}
