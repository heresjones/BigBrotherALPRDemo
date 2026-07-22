import { useState, type FormEvent } from "react";
import { useAppData } from "../context/AppDataContext";
import { RoleGate } from "../components/RoleGate";
import { formatTimestamp } from "../utils/format";

export default function OrgSettingsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Organization Settings</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Org identity, retention policy, and the shared demo API key.
      </p>
      <RoleGate allow={["Admin"]}>
        <SettingsForm />
      </RoleGate>
    </div>
  );
}

function SettingsForm() {
  const { orgSettings, updateOrgSettings, rotateApiKey } = useAppData();
  const [name, setName] = useState(orgSettings.name);
  const [retentionDays, setRetentionDays] = useState(orgSettings.retentionDays);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateOrgSettings({ name, retentionDays });
  }

  return (
    <div className="mt-4 grid gap-6 sm:grid-cols-2">
      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-4"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Organization name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Retention period (days)</span>
          <input
            type="number"
            min={1}
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
          />
        </label>
        <p className="text-xs text-[var(--text-muted)]">
          Records older than this are eligible for deletion. Enforcement is a documented manual step in this demo —
          see docs/PRD.md §13.
        </p>
        <div>
          <button type="submit" className="rounded-md bg-[var(--series-1)] px-3 py-1.5 text-sm font-medium text-white">
            Save
          </button>
        </div>
      </form>

      <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-4">
        <div className="text-sm font-medium text-[var(--text-primary)]">Shared API key</div>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Demo-grade auth per the skill doc: a single shared key checked by each Lambda. Not a real per-user
          credential.
        </p>
        <div className="mt-3 font-mono text-sm text-[var(--text-secondary)]">••••••••{orgSettings.apiKeyLast4}</div>
        <div className="mt-1 text-xs text-[var(--text-muted)]">Rotated {formatTimestamp(orgSettings.apiKeyRotatedAt)}</div>
        <button
          onClick={rotateApiKey}
          className="mt-3 rounded-md border border-[var(--border-hairline)] px-3 py-1.5 text-sm text-[var(--text-secondary)]"
        >
          Rotate key
        </button>
      </div>
    </div>
  );
}
