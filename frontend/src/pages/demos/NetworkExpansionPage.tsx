import { useState } from "react";
import { ScenarioPage } from "../../components/ScenarioUI";
import { SmallBox } from "../../components/SmallBox";

const LEVELS = [
  {
    id: "town",
    label: "Town only",
    camerasOwned: 8,
    camerasSearchable: 8,
    orgsSharingIn: 0,
    outsideOrgsCanSearch: 0,
    searchHits: 1,
  },
  {
    id: "neighbors",
    label: "Neighboring agencies",
    camerasOwned: 8,
    camerasSearchable: 240,
    orgsSharingIn: 6,
    outsideOrgsCanSearch: 6,
    searchHits: 34,
  },
  {
    id: "state",
    label: "Statewide",
    camerasOwned: 8,
    camerasSearchable: 4200,
    orgsSharingIn: 87,
    outsideOrgsCanSearch: 132,
    searchHits: 812,
  },
];

export default function NetworkExpansionPage() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [searchLog, setSearchLog] = useState<{ level: string; hits: number }[]>([]);
  const level = LEVELS[levelIndex];

  function runSearch() {
    setSearchLog((prev) => [...prev, { level: level.label, hits: level.searchHits }]);
  }

  return (
    <ScenarioPage slug="network-expansion" revealed={levelIndex === 2 && searchLog.length > 0}>
      <div className="btn-group mb-4" role="group" aria-label="Network level">
        {LEVELS.map((l, i) => (
          <button
            key={l.id}
            className={`btn ${i === levelIndex ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setLevelIndex(i)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="row">
        <SmallBox value={String(level.camerasOwned)} label="Cameras owned" icon="camera-fill" variant="secondary" />
        <SmallBox value={level.camerasSearchable.toLocaleString()} label="Cameras searchable" icon="search" variant="primary" />
        <SmallBox value={String(level.orgsSharingIn)} label="Organizations sharing in" icon="diagram-3-fill" variant="info" />
        <SmallBox
          value={String(level.outsideOrgsCanSearch)}
          label="Outside orgs able to search this town's cameras"
          icon="eye-fill"
          variant="warning"
        />
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <p>
            Run the same plate search (a single fictional plate) at the <strong>{level.label}</strong> sharing
            level:
          </p>
          <button className="btn btn-dark" onClick={runSearch}>
            <i className="bi bi-search me-1"></i>
            Run plate search
          </button>
        </div>
      </div>

      {searchLog.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Search results by network level</h3>
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>Network level</th>
                  <th>Cameras searched</th>
                  <th>Results returned</th>
                </tr>
              </thead>
              <tbody>
                {searchLog.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry.level}</td>
                    <td>{LEVELS.find((l) => l.label === entry.level)?.camerasSearchable.toLocaleString()}</td>
                    <td>
                      <strong>{entry.hits}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ScenarioPage>
  );
}
