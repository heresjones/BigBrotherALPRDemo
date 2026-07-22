import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { RecordCard } from "../components/RecordCard";
import { formatTimestamp } from "../utils/format";

export default function InvestigationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { investigations, records, currentUser, addRecordToInvestigation } = useAppData();
  const investigation = investigations.find((i) => i.id === id);
  const canEdit = currentUser.role !== "Viewer";
  const [selectedRecordId, setSelectedRecordId] = useState("");

  if (!investigation) {
    return (
      <div>
        <Link to="/investigations" className="text-sm text-[var(--series-1)]">
          ← Back to Investigations
        </Link>
        <p className="mt-4 text-sm text-[var(--text-muted)]">Investigation not found.</p>
      </div>
    );
  }

  const attachedRecords = investigation.recordIds
    .map((rid) => records.find((r) => r.recordId === rid))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  const availableRecords = records.filter((r) => !investigation.recordIds.includes(r.recordId));

  return (
    <div>
      <Link to="/investigations" className="text-sm text-[var(--series-1)]">
        ← Back to Investigations
      </Link>
      <h1 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{investigation.name}</h1>
      <div className="mt-1 text-sm text-[var(--text-muted)]">
        {investigation.createdBy} · {formatTimestamp(investigation.createdAt)}
      </div>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{investigation.notes}</p>

      <h2 className="mt-6 text-sm font-semibold text-[var(--text-primary)]">Attached records</h2>
      <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {attachedRecords.map((r) => (
          <RecordCard key={r.recordId} record={r} />
        ))}
        {attachedRecords.length === 0 && <p className="text-sm text-[var(--text-muted)]">No records attached yet.</p>}
      </div>

      {canEdit && availableRecords.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <select
            value={selectedRecordId}
            onChange={(e) => setSelectedRecordId(e.target.value)}
            className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5 text-sm"
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
            className="rounded-md bg-[var(--series-1)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            Attach
          </button>
        </div>
      )}
    </div>
  );
}
