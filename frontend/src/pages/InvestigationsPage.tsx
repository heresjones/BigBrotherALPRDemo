import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
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
    <div>
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Investigations</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Group related records into a case, with notes.</p>

      <div className="mt-4 grid gap-3">
        {investigations
          .slice()
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((inv) => (
            <Link
              key={inv.id}
              to={`/investigations/${inv.id}`}
              className="rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-3 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-[var(--text-primary)]">{inv.name}</div>
                <div className="text-xs text-[var(--text-muted)]">
                  {inv.recordIds.length} record{inv.recordIds.length === 1 ? "" : "s"}
                </div>
              </div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{inv.notes}</p>
              <div className="mt-2 text-xs text-[var(--text-muted)]">
                {inv.createdBy} · {formatTimestamp(inv.createdAt)}
              </div>
            </Link>
          ))}
      </div>

      {canCreate ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-4"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-secondary)]">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-secondary)]">Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
            />
          </label>
          <div>
            <button type="submit" className="rounded-md bg-[var(--series-1)] px-3 py-1.5 text-sm font-medium text-white">
              Create investigation
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-[var(--text-muted)]">Viewer role cannot create investigations.</p>
      )}
    </div>
  );
}
