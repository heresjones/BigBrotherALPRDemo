import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext";
import { ScenarioPage, SafeguardPanel } from "../../components/ScenarioUI";

const FICTIONAL_TARGETS = [
  "A journalist covering this agency",
  "A neighbor",
  "A former employee",
  "A former romantic partner",
  "A local political organizer",
];

const SAFEGUARDS = [
  { id: "caseNumber", label: "Require a case number and offense category" },
  { id: "supervisor", label: "Require supervisor approval for sensitive watchlists" },
  { id: "expiration", label: "Require an expiration date" },
  { id: "compliance", label: "Notify compliance personnel automatically" },
  { id: "noSelfApprove", label: "Prevent the creator from approving their own list" },
];

export default function WatchlistAbusePage() {
  const { createHotlist, currentUser } = useAppData();
  const [target, setTarget] = useState(FICTIONAL_TARGETS[0]);
  const [plate, setPlate] = useState("FIC-001");
  const [createdUnsafe, setCreatedUnsafe] = useState(false);
  const [simulatedAlerts, setSimulatedAlerts] = useState<string[]>([]);

  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  function toggleSafeguard(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  const [caseNumber, setCaseNumber] = useState("");
  const [offenseCategory, setOffenseCategory] = useState("");
  const [expiration, setExpiration] = useState("");
  const [controlledOutcome, setControlledOutcome] = useState<string | null>(null);

  function createUnsafe() {
    createHotlist(`Personal watchlist — ${target}`, "Created with no case number or offense category.", [plate]);
    setCreatedUnsafe(true);
    setSimulatedAlerts([`Arrival alert: ${plate} detected near target's residence, 2 minutes ago`]);
  }

  function attemptControlled() {
    if (enabled.caseNumber && (!caseNumber.trim() || !offenseCategory)) {
      setControlledOutcome("Blocked: a case number and offense category are required before this can be created.");
      return;
    }
    if (enabled.expiration && !expiration) {
      setControlledOutcome("Blocked: an expiration date is required for this watchlist.");
      return;
    }
    if (enabled.supervisor) {
      setControlledOutcome(
        `Pending supervisor approval — not active yet. ${
          enabled.noSelfApprove ? `${currentUser.name} cannot approve their own request; routed to a second approver.` : ""
        }`,
      );
      return;
    }
    setControlledOutcome("Created — but every required field is now attached to a reviewable case, not a name alone.");
  }

  return (
    <ScenarioPage slug="watchlist-abuse" revealed={controlledOutcome !== null}>
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Create a watchlist (no controls)</h3>
        </div>
        <div className="card-body">
          <p className="text-body-secondary">
            All targets here are fictional roles, never real people — the point is that the form doesn't require a
            reason at all.
          </p>
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label">Target</label>
              <select className="form-select" value={target} onChange={(e) => setTarget(e.target.value)}>
                {FICTIONAL_TARGETS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Plate</label>
              <input className="form-control font-monospace" value={plate} onChange={(e) => setPlate(e.target.value)} />
            </div>
            <div className="col-md-4">
              <button className="btn btn-danger" onClick={createUnsafe} disabled={createdUnsafe}>
                <i className="bi bi-eye-fill me-1"></i>
                Create watchlist
              </button>
            </div>
          </div>

          {createdUnsafe && (
            <div className="mt-3">
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Watchlist created — no case number, no approval, nothing to stop it in real time.
              </div>
              {simulatedAlerts.map((a, i) => (
                <div key={i} className="alert alert-warning">
                  <i className="bi bi-bell-fill me-2"></i>
                  {a}
                </div>
              ))}
              <div className="alert alert-secondary mb-0">
                <i className="bi bi-clipboard-data-fill me-2"></i>
                This action was written to the real audit log —{" "}
                <Link to="/audit">check Insights &amp; Audit</Link> to see it recorded, attributed to{" "}
                {currentUser.name}. Recording it is not the same as preventing it.
              </div>
            </div>
          )}
        </div>
      </div>

      <SafeguardPanel title="Replay with controls" items={SAFEGUARDS} enabled={enabled} onToggle={toggleSafeguard} />

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Case number</label>
              <input className="form-control" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} placeholder="e.g. 2026-04471" />
            </div>
            <div className="col-md-3">
              <label className="form-label">Offense category</label>
              <select className="form-select" value={offenseCategory} onChange={(e) => setOffenseCategory(e.target.value)}>
                <option value="">Select…</option>
                <option value="theft">Theft</option>
                <option value="reckless-driving">Reckless driving</option>
                <option value="warrant">Active warrant</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Expiration date</label>
              <input type="date" className="form-control" value={expiration} onChange={(e) => setExpiration(e.target.value)} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary" onClick={attemptControlled}>
                Attempt to create with controls
              </button>
            </div>
          </div>
          {controlledOutcome && (
            <div className={`alert mt-3 mb-0 ${controlledOutcome.startsWith("Blocked") ? "alert-success" : "alert-info"}`}>
              <i className="bi bi-info-circle-fill me-2"></i>
              {controlledOutcome}
            </div>
          )}
        </div>
      </div>
    </ScenarioPage>
  );
}
