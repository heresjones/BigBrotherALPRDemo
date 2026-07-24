import { useState } from "react";
import { ScenarioPage, SafeguardPanel } from "../../components/ScenarioUI";
import { ClaimBadge, type ClaimLevel } from "../../components/ClaimBadge";

const DEFAULT_REASON = "Nova investigation";
const DEFAULT_RADIUS = 1500;
const LOCAL_JURISDICTION_RADIUS = 50;

const IDENTIFIER_TYPES: Record<string, string> = {
  "Email address": "j.doe.demo@example.test",
  "Social Security Number": "XXX-XX-4471",
  "IP address": "203.0.113.42",
  "Crypto wallet address": "bc1q-demo-fictional-0000",
  "Discord handle": "demo_user#0001",
  "Telegram handle": "@demo_user_fake",
  "Credit card number": "4111 1111 1111 1111 (test)",
};

interface CategoryResult {
  category: string;
  claim: ClaimLevel;
  detail: string;
}

const RESULTS: CategoryResult[] = [
  { category: "Vehicle detections", claim: "observed", detail: "3 detections across 2 cameras in the past 90 days" },
  {
    category: "Financial transaction reference",
    claim: "external",
    detail: "1 flagged transaction linked to this identifier via a third-party financial data broker",
  },
  {
    category: "IP geolocation cluster",
    claim: "inferred",
    detail: "Repeated connections cluster around one residential address — inferred as likely home location",
  },
  {
    category: "Messaging platform metadata",
    claim: "external",
    detail: "Account activity linked to this identifier by a third-party data broker",
  },
  {
    category: "Breach-data aggregation reference",
    claim: "external",
    detail: "Identifier appears in a breach-data aggregation source unrelated to this agency",
  },
];

const SAFEGUARDS = [
  { id: "caseJustification", label: "Require a case-linked justification instead of the default placeholder" },
  { id: "capRadius", label: "Cap default search radius to local jurisdiction" },
  { id: "identifierSignoff", label: "Require supervisor sign-off for identifier searches beyond vehicle data" },
];

export default function DarkDataSearchPage() {
  const [identifierType, setIdentifierType] = useState(Object.keys(IDENTIFIER_TYPES)[0]);
  const [radiusMiles, setRadiusMiles] = useState(DEFAULT_RADIUS);
  const [reason, setReason] = useState(DEFAULT_REASON);
  const [submitted, setSubmitted] = useState(false);

  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  function toggleSafeguard(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  const [replayed, setReplayed] = useState(false);

  function replayOutcome(): { variant: string; message: string } {
    if (enabled.identifierSignoff) {
      return { variant: "success", message: "Routed to supervisor sign-off — the search does not run until approved." };
    }
    if (enabled.caseJustification && reason.trim() === DEFAULT_REASON) {
      return {
        variant: "success",
        message:
          "Blocked: the reason field still contains the system default. A case-linked justification is required before this search can run.",
      };
    }
    if (enabled.capRadius && radiusMiles > LOCAL_JURISDICTION_RADIUS) {
      return {
        variant: "success",
        message: `Scope reduced to ${LOCAL_JURISDICTION_RADIUS} miles (local jurisdiction) instead of ${radiusMiles} — most of the categories above would not have been returned.`,
      };
    }
    return {
      variant: "danger",
      message: "Search still executes exactly as before — none of the enabled safeguards addressed this failure mode.",
    };
  }

  return (
    <ScenarioPage slug="dark-data-search" revealed={replayed}>
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">New search</h3>
        </div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Identifier type</label>
              <select className="form-select" value={identifierType} onChange={(e) => setIdentifierType(e.target.value)}>
                {Object.keys(IDENTIFIER_TYPES).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Value</label>
              <input className="form-control font-monospace" value={IDENTIFIER_TYPES[identifierType]} disabled />
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary w-100" onClick={() => setSubmitted(true)}>
                <i className="bi bi-search me-1"></i>
                Run identifier search
              </button>
            </div>
          </div>

          <div className="row g-3 mt-1">
            <div className="col-md-4">
              <label className="form-label">
                Search radius <span className="text-body-secondary">(system default)</span>
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={radiusMiles}
                  onChange={(e) => setRadiusMiles(Number(e.target.value))}
                />
                <span className="input-group-text">miles</span>
              </div>
              {radiusMiles === DEFAULT_RADIUS && (
                <div className="form-text">1,500 miles — roughly the entire continental United States.</div>
              )}
            </div>
            <div className="col-md-8">
              <label className="form-label">
                Reason for search <span className="text-body-secondary">(auto-filled by the system)</span>
              </label>
              <input className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} />
              {reason === DEFAULT_REASON && (
                <div className="form-text">No officer wrote this — it's the platform's default placeholder.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {submitted && (
        <>
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            No plate was ever entered. One {identifierType.toLowerCase()} returned results across{" "}
            {RESULTS.length} unrelated data categories, searched nationwide, under a reason nobody actually wrote.
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Results</h3>
            </div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Detail</th>
                    <th>Claim</th>
                  </tr>
                </thead>
                <tbody>
                  {RESULTS.map((r) => (
                    <tr key={r.category}>
                      <td>{r.category}</td>
                      <td className="text-body-secondary">{r.detail}</td>
                      <td>
                        <ClaimBadge level={r.claim} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <SafeguardPanel title="Replay with safeguards" items={SAFEGUARDS} enabled={enabled} onToggle={toggleSafeguard} />
          <button className="btn btn-dark mb-4" onClick={() => setReplayed(true)}>
            <i className="bi bi-arrow-repeat me-1"></i>
            Replay search with safeguards
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
