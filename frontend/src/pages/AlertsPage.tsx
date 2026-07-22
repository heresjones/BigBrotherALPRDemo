import { useState, type FormEvent } from "react";
import { useAppData } from "../context/AppDataContext";
import { AlertStatusBadge, ActiveStatusBadge } from "../components/Badge";
import { MockBanner } from "../components/MockBanner";
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
    <div>
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Alerts</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Hotlist matches generated from incoming records.</p>
      <MockBanner>
        Every hotlist here is demo data created inside this org — there is no NCIC, AMBER Alert, or other government
        feed in this demo. See <code>docs/PRD.md §7.5</code>.
      </MockBanner>

      <div className="overflow-x-auto rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)]">
              <th className="px-3 py-2 font-medium">Plate</th>
              <th className="px-3 py-2 font-medium">Hotlist</th>
              <th className="px-3 py-2 font-medium">Record captured</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Details</th>
              <th className="px-3 py-2 font-medium">Actions</th>
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
                  <tr key={alert.id} className="border-b border-[var(--border-hairline)] last:border-0">
                    <td className="px-3 py-2 font-mono font-semibold text-[var(--text-primary)]">{alert.matchedPlateText}</td>
                    <td className="px-3 py-2 text-[var(--text-secondary)]">{hotlist?.name ?? alert.hotlistId}</td>
                    <td className="px-3 py-2 text-[var(--text-secondary)]">{record ? formatTimestamp(record.capturedAt) : "—"}</td>
                    <td className="px-3 py-2">
                      <AlertStatusBadge status={alert.status} />
                    </td>
                    <td className="px-3 py-2 text-[var(--text-secondary)]">
                      {alert.reviewNote ?? <span className="text-[var(--text-muted)]">—</span>}
                    </td>
                    <td className="px-3 py-2">
                      {alert.status === "new" ? (
                        canAct ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              placeholder="Note (optional)"
                              value={noteDrafts[alert.id] ?? ""}
                              onChange={(e) => setNoteDrafts((d) => ({ ...d, [alert.id]: e.target.value }))}
                              className="w-32 rounded-md border border-[var(--border-hairline)] bg-transparent px-1.5 py-1 text-xs"
                            />
                            <button
                              onClick={() => reviewAlert(alert.id, "reviewed", noteDrafts[alert.id] || undefined)}
                              className="rounded-md px-2 py-1 text-xs font-medium text-white"
                              style={{ backgroundColor: "var(--status-good)" }}
                            >
                              Reviewed
                            </button>
                            <button
                              onClick={() => reviewAlert(alert.id, "dismissed", noteDrafts[alert.id] || undefined)}
                              className="rounded-md border border-[var(--border-hairline)] px-2 py-1 text-xs text-[var(--text-secondary)]"
                            >
                              Dismiss
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)]" title="Viewer role cannot act on alerts">
                            View only
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">by {alert.reviewedBy}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-sm font-semibold text-[var(--text-primary)]">Hotlists</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {hotlists.map((h) => (
          <div key={h.id} className="rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-[var(--text-primary)]">{h.name}</div>
              <ActiveStatusBadge active={h.active} />
            </div>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{h.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {h.entries.map((entry) => (
                <span
                  key={entry.id}
                  title={entry.note}
                  className="rounded-md bg-black/5 px-1.5 py-0.5 font-mono text-xs text-[var(--text-secondary)] dark:bg-white/10"
                >
                  {entry.plateText}
                </span>
              ))}
            </div>
            <div className="mt-2 text-xs text-[var(--text-muted)]">Created by {h.createdBy}</div>
          </div>
        ))}
      </div>

      {canAct ? (
        <form
          onSubmit={handleCreateHotlist}
          className="mt-4 grid gap-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-4 sm:grid-cols-3"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-secondary)]">Name</span>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-secondary)]">Description</span>
            <input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-secondary)]">Plates (comma-separated)</span>
            <input
              value={newPlates}
              onChange={(e) => setNewPlates(e.target.value)}
              placeholder="7ABC123, 9XYZ456"
              className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
            />
          </label>
          <div className="sm:col-span-3">
            <button type="submit" className="rounded-md bg-[var(--series-1)] px-3 py-1.5 text-sm font-medium text-white">
              Create hotlist
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-3 text-sm text-[var(--text-muted)]">Viewer role cannot create hotlists.</p>
      )}
    </div>
  );
}
