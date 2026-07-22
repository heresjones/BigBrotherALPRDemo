import { useAppData } from "../context/AppDataContext";

export function Topbar() {
  const { users, currentUser, setCurrentUserId, orgSettings } = useAppData();
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border-hairline)] bg-[var(--surface-1)] px-4">
      <div className="text-sm font-medium text-[var(--text-primary)]">{orgSettings.name}</div>
      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="acting-as" className="text-[var(--text-muted)]">
          Acting as
        </label>
        <select
          id="acting-as"
          value={currentUser.id}
          onChange={(e) => setCurrentUserId(e.target.value)}
          className="rounded-md border border-[var(--border-hairline)] bg-[var(--surface-1)] px-2 py-1 text-sm text-[var(--text-primary)]"
        >
          {users
            .filter((u) => u.active)
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
        </select>
      </div>
    </header>
  );
}
