import { useState } from "react";
import { ScenarioPage } from "../../components/ScenarioUI";
import { ClaimBadge } from "../../components/ClaimBadge";

interface AppearanceMatch {
  plate: string;
  color: string;
  type: string;
  flag?: string;
  flagVariant?: string;
}

// Ordered by descending match confidence (rank 1 = closest to the description).
const RESULTS: AppearanceMatch[] = [
  { plate: "GRY-SUV1", color: "Gray", type: "SUV", flag: "Possible suspect vehicle — roof rack and bumper damage both present", flagVariant: "danger" },
  { plate: "9WQZ204", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "2LKT887", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "7VBN551", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "4RTY330", color: "Gray", type: "SUV", flag: "Flagged “damage” may be a shadow across the bumper", flagVariant: "warning" },
  { plate: "8MKL772", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "3PLO994", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "6XCV118", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "1QAZ662", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "5WSX408", color: "Blue", type: "SUV", flag: "Color likely misclassified — vehicle appears blue in source image", flagVariant: "warning" },
  { plate: "0EDC275", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "9RFV839", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "2TGB506", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "7YHN183", color: "Gray", type: "SUV", flag: "Roof rack detection may be a satellite antenna", flagVariant: "warning" },
  { plate: "4UJM927", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "8IKO364", color: "Gray", type: "Crossover", flag: "Similar vehicle" },
  { plate: "1OLP710", color: "Gray", type: "SUV", flag: "Similar vehicle" },
  { plate: "6PMN459", color: "Gray", type: "Wagon", flag: "Similar vehicle" },
];

const FILTER_LEVELS = [
  { id: "strict", label: "Strict", count: 4 },
  { id: "moderate", label: "Moderate", count: 10 },
  { id: "loose", label: "Loose", count: 18 },
];

export default function AppearanceSearchPage() {
  const [filterIndex, setFilterIndex] = useState(1);
  const [searched, setSearched] = useState(false);
  const visible = RESULTS.slice(0, FILTER_LEVELS[filterIndex].count);

  return (
    <ScenarioPage slug="appearance-search" revealed={searched}>
      <div className="card mb-4">
        <div className="card-body">
          <p className="mb-2 text-body-secondary">Description-based search (no plate entered):</p>
          <blockquote className="fs-5 mb-3">
            &ldquo;Gray SUV with roof rack and rear bumper damage, between 8:00 and 10:00 PM.&rdquo;
          </blockquote>
          <button className="btn btn-primary" onClick={() => setSearched(true)}>
            <i className="bi bi-search me-1"></i>
            Search by appearance
          </button>
        </div>
      </div>

      {searched && (
        <>
          <div className="mb-4">
            <label className="form-label d-block">Match strictness</label>
            <div className="btn-group" role="group">
              {FILTER_LEVELS.map((f, i) => (
                <button
                  key={f.id}
                  className={`btn ${i === filterIndex ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setFilterIndex(i)}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
            <p className="text-body-secondary small mt-2 mb-0">
              Loosening the filter doesn't find better evidence — it enlarges the candidate pool.
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{visible.length} candidates</h3>
            </div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Plate</th>
                    <th>Vehicle</th>
                    <th>Note</th>
                    <th>Claim</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((v) => (
                    <tr key={v.plate}>
                      <td className="font-monospace">{v.plate}</td>
                      <td>
                        {v.color} {v.type}
                      </td>
                      <td>
                        {v.flag && v.flagVariant ? (
                          <span className={`badge text-bg-${v.flagVariant}`}>{v.flag}</span>
                        ) : (
                          <span className="text-body-secondary small">{v.flag}</span>
                        )}
                      </td>
                      <td>
                        <ClaimBadge level="estimated" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </ScenarioPage>
  );
}
