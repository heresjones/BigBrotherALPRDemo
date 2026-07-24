import { useState } from "react";
import { ScenarioPage } from "../../components/ScenarioUI";
import { ClaimBadge } from "../../components/ClaimBadge";

const LOCATION_TYPES = [
  "Fictional community health clinic",
  "Fictional protest assembly point",
  "Fictional union hall",
  "Fictional place of worship",
  "Fictional immigration-services office",
];

const RESULT_VEHICLES = [
  { plate: "7QRX119", color: "Blue", type: "Sedan", time: "7:58 PM" },
  { plate: "2MNB204", color: "White", type: "SUV", time: "8:03 PM" },
  { plate: "9KDL887", color: "Black", type: "Pickup Truck", time: "8:11 PM" },
  { plate: "4TXY552", color: "Gray", type: "Hatchback", time: "8:19 PM" },
  { plate: "1CVW338", color: "Red", type: "Sedan", time: "8:34 PM" },
  { plate: "6PLM901", color: "Silver", type: "SUV", time: "8:47 PM" },
  { plate: "3FGH475", color: "White", type: "Van", time: "9:02 PM" },
  { plate: "8ZXQ610", color: "Green", type: "Sedan", time: "9:15 PM" },
];

export default function SensitiveLocationPage() {
  const [locationType, setLocationType] = useState(LOCATION_TYPES[0]);
  const [start, setStart] = useState("19:30");
  const [end, setEnd] = useState("21:00");
  const [requireLegalReview, setRequireLegalReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <ScenarioPage slug="sensitive-location" revealed={submitted}>
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label">Search area (location type)</label>
              <select className="form-select" value={locationType} onChange={(e) => setLocationType(e.target.value)}>
                {LOCATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">From</label>
              <input type="time" className="form-control" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">To</label>
              <input type="time" className="form-control" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={() => setSubmitted(true)}>
                <i className="bi bi-search me-1"></i>
                Search this area
              </button>
            </div>
          </div>
          <p className="text-body-secondary small mt-3 mb-0">
            No name and no plate were entered anywhere in this form — the search runs purely on space and time.
          </p>
        </div>
      </div>

      <div className="form-check form-switch mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="legal-review"
          checked={requireLegalReview}
          onChange={() => setRequireLegalReview((v) => !v)}
        />
        <label className="form-check-label" htmlFor="legal-review">
          Policy control: require legal review for protected-activity locations
        </label>
      </div>

      {submitted && (
        <>
          {requireLegalReview ? (
            <div className="alert alert-success">
              <i className="bi bi-hourglass-split me-2"></i>
              <strong>Pending legal review.</strong> This search targets a protected-activity location
              ({locationType}) and cannot return results until legal counsel signs off.
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  {RESULT_VEHICLES.length} vehicles observed near {locationType}, {start}–{end}
                </h3>
              </div>
              <div className="card-body p-0">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Plate</th>
                      <th>Vehicle</th>
                      <th>Time</th>
                      <th>Claim</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESULT_VEHICLES.map((v) => (
                      <tr key={v.plate}>
                        <td className="font-monospace">{v.plate}</td>
                        <td>
                          {v.color} {v.type}
                        </td>
                        <td>{v.time}</td>
                        <td>
                          <ClaimBadge level="observed" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </ScenarioPage>
  );
}
