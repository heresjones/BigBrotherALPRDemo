import { useState } from "react";
import { ScenarioPage, SafeguardPanel } from "../../components/ScenarioUI";
import { ClaimBadge } from "../../components/ClaimBadge";
import { VehiclePhoto } from "../../components/VehiclePhoto";

const READ_PLATE = "BG-82168";
const HOTLIST_PLATE = "BQ-82168";
const CONFIDENCE = 72;

const SAFEGUARDS = [
  { id: "confidence", label: "Require ≥90% OCR confidence before alerting" },
  { id: "attributes", label: "Compare make, model, and color before alerting" },
  { id: "humanReview", label: "Require a human to inspect the photograph" },
  { id: "activeCheck", label: "Confirm the hotlist entry is still active" },
];

export default function FalseMatchPage() {
  const [automaticMatching, setAutomaticMatching] = useState(true);
  const [processed, setProcessed] = useState(false);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [replayed, setReplayed] = useState(false);

  function toggleSafeguard(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function replayOutcome(): { variant: string; message: string } {
    if (enabled.humanReview) {
      return { variant: "success", message: "Routed to manual photo review — no automatic alert sent." };
    }
    if (enabled.confidence) {
      return {
        variant: "success",
        message: `Suppressed automatically: OCR confidence ${CONFIDENCE}% is below the required 90% threshold.`,
      };
    }
    if (enabled.attributes) {
      return {
        variant: "success",
        message:
          "Flagged, not alerted: observed vehicle (White Sedan) does not match the hotlist entry (Black Pickup Truck).",
      };
    }
    return {
      variant: "danger",
      message:
        "Urgent alert still sent automatically — none of the enabled safeguards addressed this failure mode.",
    };
  }

  return (
    <ScenarioPage slug="false-match" revealed={replayed}>
      <div className="row">
        <div className="col-md-5">
          <div className="card mb-4">
            <VehiclePhoto src="/vehicle-photos/white-sedan.jpg" plateText={READ_PLATE} alt={READ_PLATE} />
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="font-monospace-lg">{READ_PLATE}</span>
                <ClaimBadge level="estimated" />
              </div>
              <p className="mb-1">OCR confidence: <strong>{CONFIDENCE}%</strong></p>
              <p className="text-body-secondary small mb-0">White Sedan — observed vehicle attributes.</p>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Candidate ranking</h3>
            </div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Plate</th>
                    <th>Source</th>
                    <th>Match confidence</th>
                    <th>Claim</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-monospace">{READ_PLATE}</td>
                    <td>Direct OCR read</td>
                    <td>{CONFIDENCE}%</td>
                    <td>
                      <ClaimBadge level="estimated" />
                    </td>
                  </tr>
                  <tr className="table-warning">
                    <td className="font-monospace">{HOTLIST_PLATE}</td>
                    <td>Hotlist: Stolen Vehicle Reports (active)</td>
                    <td>68% (character-similarity alternative)</td>
                    <td>
                      <ClaimBadge level="external" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="auto-matching"
                  checked={automaticMatching}
                  onChange={() => setAutomaticMatching((v) => !v)}
                />
                <label className="form-check-label" htmlFor="auto-matching">
                  Automatic matching enabled
                </label>
              </div>
              <button className="btn btn-primary" onClick={() => setProcessed(true)}>
                Process detection
              </button>

              {processed && (
                <div className="mt-3">
                  {automaticMatching ? (
                    <div className="alert alert-danger mb-2">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <strong>Urgent alert sent</strong> — plate ranked against hotlisted {HOTLIST_PLATE}.
                    </div>
                  ) : (
                    <div className="alert alert-secondary mb-2">Automatic matching is off — no alert sent.</div>
                  )}
                  <div className="alert alert-warning mb-0">
                    <i className="bi bi-flag-fill me-2"></i>
                    Reveal: the observed vehicle is a <strong>White Sedan</strong>. The hotlist entry describes a{" "}
                    <strong>Black Pickup Truck</strong>. Nothing checked this before alerting.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {processed && (
        <>
          <SafeguardPanel title="Replay with safeguards" items={SAFEGUARDS} enabled={enabled} onToggle={toggleSafeguard} />
          <button className="btn btn-dark mb-4" onClick={() => setReplayed(true)}>
            <i className="bi bi-arrow-repeat me-1"></i>
            Replay detection with safeguards
          </button>
          {replayed && (
            <div className={`alert alert-${replayOutcome().variant}`}>
              <i className="bi bi-info-circle-fill me-2"></i>
              {replayOutcome().message}
            </div>
          )}
        </>
      )}
    </ScenarioPage>
  );
}
