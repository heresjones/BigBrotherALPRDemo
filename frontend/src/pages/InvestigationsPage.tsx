import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { PageHeader, PageContent } from "../components/Page";
import { formatTimestamp } from "../utils/format";

export default function InvestigationsPage() {
  const { investigations, currentUser, createInvestigation } = useAppData();
  const canCreate = currentUser.role !== "Viewer";
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createInvestigation(name.trim(), notes.trim());
    setName("");
    setNotes("");
  }

  return (
    <>
      <PageHeader title="Investigations" lead="Group related records into a case, with notes." />
      <PageContent>
        <div className="card mb-4">
          <div className="card-body p-0">
            <ul className="list-group list-group-flush">
              {investigations
                .slice()
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .map((inv) => (
                  <Link
                    key={inv.id}
                    to={`/investigations/${inv.id}`}
                    className="list-group-item list-group-item-action"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="mb-1">{inv.name}</h5>
                      <span className="badge text-bg-secondary">
                        {inv.recordIds.length} record{inv.recordIds.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="mb-1 text-body-secondary">{inv.notes}</p>
                    <small className="text-body-secondary">
                      {inv.createdBy} · {formatTimestamp(inv.createdAt)}
                    </small>
                  </Link>
                ))}
              {investigations.length === 0 && <li className="list-group-item text-body-secondary">No investigations yet.</li>}
            </ul>
          </div>
        </div>

        {canCreate ? (
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Create investigation</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={1} className="form-control" />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary">
                    Create investigation
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <p className="text-body-secondary">Viewer role cannot create investigations.</p>
        )}
      </PageContent>
    </>
  );
}
