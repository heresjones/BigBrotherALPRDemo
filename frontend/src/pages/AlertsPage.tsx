import { useState, type FormEvent } from "react";
import { useAppData } from "../context/AppDataContext";
import { AlertStatusBadge, ActiveStatusBadge } from "../components/Badge";
import { MockBanner } from "../components/MockBanner";
import { PageHeader, PageContent } from "../components/Page";
import { formatTimestamp } from "../utils/format";

export default function AlertsPage() {
  const { alerts, hotlists, records, currentUser, reviewAlert, createHotlist } = useAppData();
  const canAct = currentUser.role !== "Viewer";
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPlates, setNewPlates] = useState("");

  function recordFor(recordId: string) {
    return records.find((r) => r.recordId === recordId);
  }
  function hotlistFor(hotlistId: string) {
    return hotlists.find((h) => h.id === hotlistId);
  }

  function handleCreateHotlist(e: FormEvent) {
    e.preventDefault();
    const plates = newPlates
      .split(",")
      .map((p) => p.trim().toUpperCase())
      .filter(Boolean);
    if (!newName.trim() || plates.length === 0) return;
    createHotlist(newName.trim(), newDescription.trim(), plates);
    setNewName("");
    setNewDescription("");
    setNewPlates("");
  }

  return (
    <>
      <PageHeader title="Alerts" lead="Hotlist matches generated from incoming records." />
      <PageContent>
        <MockBanner>
          Every hotlist here is demo data created inside this org — there is no NCIC, AMBER Alert, or other
          government feed in this demo. See <code>docs/PRD.md §7.5</code>.
        </MockBanner>

        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Alert queue</h3>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Plate</th>
                    <th>Hotlist</th>
                    <th>Record captured</th>
                    <th>Status</th>
                    <th>Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts
                    .slice()
                    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                    .map((alert) => {
                      const record = recordFor(alert.recordId);
                      const hotlist = hotlistFor(alert.hotlistId);
                      return (
                        <tr key={alert.id}>
                          <td className="font-monospace-lg">{alert.matchedPlateText}</td>
                          <td>{hotlist?.name ?? alert.hotlistId}</td>
                          <td>{record ? formatTimestamp(record.capturedAt) : "—"}</td>
                          <td>
                            <AlertStatusBadge status={alert.status} />
                          </td>
                          <td className="text-body-secondary">{alert.reviewNote ?? "—"}</td>
                          <td>
                            {alert.status === "new" ? (
                              canAct ? (
                                <div className="d-flex align-items-center gap-1">
                                  <input
                                    type="text"
                                    placeholder="Note (optional)"
                                    value={noteDrafts[alert.id] ?? ""}
                                    onChange={(e) => setNoteDrafts((d) => ({ ...d, [alert.id]: e.target.value }))}
                                    className="form-control form-control-sm"
                                    style={{ width: 140 }}
                                  />
                                  <button
                                    onClick={() => reviewAlert(alert.id, "reviewed", noteDrafts[alert.id] || undefined)}
                                    className="btn btn-success btn-sm text-nowrap"
                                  >
                                    Reviewed
                                  </button>
                                  <button
                                    onClick={() => reviewAlert(alert.id, "dismissed", noteDrafts[alert.id] || undefined)}
                                    className="btn btn-outline-secondary btn-sm"
                                  >
                                    Dismiss
                                  </button>
                                </div>
                              ) : (
                                <span className="text-body-secondary small" title="Viewer role cannot act on alerts">
                                  View only
                                </span>
                              )
                            ) : (
                              <span className="text-body-secondary small">by {alert.reviewedBy}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h3 className="fs-5 mb-3">Hotlists</h3>
        <div className="row">
          {hotlists.map((h) => (
            <div key={h.id} className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="card-title mb-0">{h.name}</h5>
                    <ActiveStatusBadge active={h.active} />
                  </div>
                  <p className="card-text text-body-secondary mt-2">{h.description}</p>
                  <div className="d-flex flex-wrap gap-1 mb-2">
                    {h.entries.map((entry) => (
                      <span key={entry.id} title={entry.note} className="badge text-bg-light border font-monospace">
                        {entry.plateText}
                      </span>
                    ))}
                  </div>
                  <small className="text-body-secondary">Created by {h.createdBy}</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {canAct ? (
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Create hotlist</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateHotlist} className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Name</label>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Description</label>
                  <input
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Plates (comma-separated)</label>
                  <input
                    value={newPlates}
                    onChange={(e) => setNewPlates(e.target.value)}
                    placeholder="7ABC123, 9XYZ456"
                    className="form-control"
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary">
                    Create hotlist
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <p className="text-body-secondary">Viewer role cannot create hotlists.</p>
        )}
      </PageContent>
    </>
  );
}
