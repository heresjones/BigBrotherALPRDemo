import { useState, type FormEvent } from "react";
import { useAppData } from "../context/AppDataContext";
import { RoleGate } from "../components/RoleGate";
import { PageHeader, PageContent } from "../components/Page";
import { formatTimestamp } from "../utils/format";

export default function OrgSettingsPage() {
  return (
    <>
      <PageHeader title="Organization Settings" lead="Org identity, retention policy, and API access." />
      <PageContent>
        <RoleGate allow={["Admin"]}>
          <SettingsForm />
        </RoleGate>
      </PageContent>
    </>
  );
}

function SettingsForm() {
  const { orgSettings, updateOrgSettings, rotateApiKey, deviationSensitivity, setDeviationSensitivity } = useAppData();
  const [name, setName] = useState(orgSettings.name);
  const [retentionDays, setRetentionDays] = useState(orgSettings.retentionDays);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateOrgSettings({ name, retentionDays });
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Organization</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Organization name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Retention period (days)</label>
                <input
                  type="number"
                  min={1}
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(Number(e.target.value))}
                  className="form-control"
                  style={{ maxWidth: 160 }}
                />
                <div className="form-text">Records older than this are eligible for deletion.</div>
              </div>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Shared API key</h3>
          </div>
          <div className="card-body">
            <p className="text-body-secondary">
              A single shared key used to authenticate API requests for this organization.
            </p>
            <div className="font-monospace-lg mb-1">••••••••{orgSettings.apiKeyLast4}</div>
            <div className="text-body-secondary small mb-3">Rotated {formatTimestamp(orgSettings.apiKeyRotatedAt)}</div>
            <button onClick={rotateApiKey} className="btn btn-outline-secondary">
              <i className="bi bi-arrow-repeat me-1"></i>
              Rotate key
            </button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Deviation alerting</h3>
          </div>
          <div className="card-body">
            <p className="text-body-secondary">
              Controls how easily a vehicle's own recent history has to break its pattern before it's flagged, for
              every vehicle in the org. Per-vehicle alerting can still be turned off from that vehicle's profile.
            </p>
            <label htmlFor="org-deviation-sensitivity" className="form-label mb-1">
              Sensitivity: {deviationSensitivity}
            </label>
            <input
              id="org-deviation-sensitivity"
              type="range"
              className="form-range"
              min={0}
              max={100}
              step={5}
              value={deviationSensitivity}
              onChange={(e) => setDeviationSensitivity(Number(e.target.value))}
            />
            <div className="d-flex justify-content-between small text-body-secondary">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
