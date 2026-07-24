import { useState } from "react";
import { ScenarioPage } from "../../components/ScenarioUI";

const PUBLIC_CONFIG = {
  capture: "Still vehicle images",
  retention: "30-day retention",
  cameras: "8 cameras",
  scope: "Local searches only",
  alerts: "Plate hotlist only",
};

const TOGGLES = [
  { id: "recordedVideo", label: "Enable recorded video" },
  { id: "liveViewing", label: "Enable live viewing" },
  { id: "retention365", label: "Extend retention to 365 days" },
  { id: "regionalSharing", label: "Enable regional sharing" },
  { id: "descriptionAlerts", label: "Enable vehicle-description alerts" },
  { id: "thirdPartyCameras", label: "Add third-party cameras" },
];

function ConfigRow({ label, publicValue, currentValue }: { label: string; publicValue: string; currentValue: string }) {
  const changed = publicValue !== currentValue;
  return (
    <tr className={changed ? "table-warning" : ""}>
      <td className="text-body-secondary">{label}</td>
      <td>{currentValue}</td>
      {changed && (
        <td className="text-body-secondary small">
          <i className="bi bi-arrow-left me-1"></i>
          was: {publicValue}
        </td>
      )}
    </tr>
  );
}

export default function CapabilityCreepPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  const anyEnabled = Object.values(enabled).some(Boolean);

  const capture = [
    "Still vehicle images",
    enabled.recordedVideo ? "Recorded video" : null,
    enabled.liveViewing ? "Live viewing" : null,
  ]
    .filter(Boolean)
    .join(" + ");
  const retention = enabled.retention365 ? "365-day retention" : "30-day retention";
  const cameras = enabled.thirdPartyCameras ? "8 owned + 340 third-party" : "8 cameras";
  const scope = enabled.regionalSharing ? "Regional searches" : "Local searches only";
  const alerts = [
    "Plate hotlist",
    enabled.descriptionAlerts ? "vehicle-description alerts" : null,
  ]
    .filter(Boolean)
    .join(" + ");

  return (
    <ScenarioPage slug="capability-creep" revealed={anyEnabled}>
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Publicly approved configuration</h3>
        </div>
        <div className="card-body">
          <p className="text-body-secondary small mb-2">This card never changes — it's what the public debate approved.</p>
          <ul className="mb-0">
            <li>{PUBLIC_CONFIG.capture}</li>
            <li>{PUBLIC_CONFIG.retention}</li>
            <li>{PUBLIC_CONFIG.cameras}</li>
            <li>{PUBLIC_CONFIG.scope}</li>
            <li>{PUBLIC_CONFIG.alerts}</li>
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Administrator changes</h3>
        </div>
        <div className="card-body">
          {TOGGLES.map((t) => (
            <div className="form-check form-switch mb-2" key={t.id}>
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id={t.id}
                checked={enabled[t.id] ?? false}
                onChange={() => toggle(t.id)}
              />
              <label className="form-check-label" htmlFor={t.id}>
                {t.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Current configuration</h3>
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <tbody>
              <ConfigRow label="Capture" publicValue={PUBLIC_CONFIG.capture} currentValue={capture} />
              <ConfigRow label="Retention" publicValue={PUBLIC_CONFIG.retention} currentValue={retention} />
              <ConfigRow label="Cameras" publicValue={PUBLIC_CONFIG.cameras} currentValue={cameras} />
              <ConfigRow label="Search scope" publicValue={PUBLIC_CONFIG.scope} currentValue={scope} />
              <ConfigRow label="Alerts" publicValue={PUBLIC_CONFIG.alerts} currentValue={alerts} />
            </tbody>
          </table>
        </div>
      </div>
    </ScenarioPage>
  );
}
