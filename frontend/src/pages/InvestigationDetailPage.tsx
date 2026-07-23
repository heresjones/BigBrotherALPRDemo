import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { RecordCard } from "../components/RecordCard";
import { PageHeader, PageContent } from "../components/Page";
import { formatTimestamp } from "../utils/format";

export default function InvestigationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { investigations, records, currentUser, addRecordToInvestigation } = useAppData();
  const investigation = investigations.find((i) => i.id === id);
  const canEdit = currentUser.role !== "Viewer";
  const [selectedRecordId, setSelectedRecordId] = useState("");

  if (!investigation) {
    return (
      <>
        <PageHeader title="Investigation not found" />
        <PageContent>
          <Link to="/investigations" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Investigations
          </Link>
        </PageContent>
      </>
    );
  }

  const attachedRecords = investigation.recordIds
    .map((rid) => records.find((r) => r.recordId === rid))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  const availableRecords = records.filter((r) => !investigation.recordIds.includes(r.recordId));

  return (
    <>
      <PageHeader title={investigation.name} lead={`${investigation.createdBy} · ${formatTimestamp(investigation.createdAt)}`} />
      <PageContent>
        <Link to="/investigations" className="btn btn-outline-secondary btn-sm mb-3">
          <i className="bi bi-arrow-left me-1"></i>
          Back to Investigations
        </Link>

        <div className="card mb-4">
          <div className="card-body">
            <p className="card-text mb-0">{investigation.notes}</p>
          </div>
        </div>

        <h3 className="fs-5 mb-3">Attached records</h3>
        <div className="row">
          {attachedRecords.map((r) => (
            <RecordCard key={r.recordId} record={r} />
          ))}
          {attachedRecords.length === 0 && <p className="text-body-secondary">No records attached yet.</p>}
        </div>

        {canEdit && availableRecords.length > 0 && (
          <div className="card">
            <div className="card-body d-flex align-items-center gap-2 flex-wrap">
              <select
                value={selectedRecordId}
                onChange={(e) => setSelectedRecordId(e.target.value)}
                className="form-select"
                style={{ maxWidth: 320 }}
              >
                <option value="">Select a record…</option>
                {availableRecords.map((r) => (
                  <option key={r.recordId} value={r.recordId}>
                    {r.plateText ?? "Unreadable"} — {formatTimestamp(r.capturedAt)}
                  </option>
                ))}
              </select>
              <button
                disabled={!selectedRecordId}
                onClick={() => {
                  addRecordToInvestigation(investigation.id, selectedRecordId);
                  setSelectedRecordId("");
                }}
                className="btn btn-primary"
              >
                Attach
              </button>
            </div>
          </div>
        )}
      </PageContent>
    </>
  );
}
