import { useAppData } from "../context/AppDataContext";
import { ActiveStatusBadge, Pill } from "../components/Badge";
import { RoleGate } from "../components/RoleGate";

export default function UsersRolesPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Users &amp; Roles</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Fixed demo roles: Admin (full access), Investigator (search, alerts, investigations), Viewer (read-only
        search).
      </p>
      <RoleGate allow={["Admin"]}>
        <UsersTable />
      </RoleGate>
    </div>
  );
}

function UsersTable() {
  const { users, toggleUserActive } = useAppData();
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)]">
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Email</th>
            <th className="px-3 py-2 font-medium">Role</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-[var(--border-hairline)] last:border-0">
              <td className="px-3 py-2 text-[var(--text-primary)]">{u.name}</td>
              <td className="px-3 py-2 text-[var(--text-secondary)]">{u.email}</td>
              <td className="px-3 py-2">
                <Pill>{u.role}</Pill>
              </td>
              <td className="px-3 py-2">
                <ActiveStatusBadge active={u.active} />
              </td>
              <td className="px-3 py-2">
                <button
                  onClick={() => toggleUserActive(u.id)}
                  className="rounded-md border border-[var(--border-hairline)] px-2 py-1 text-xs text-[var(--text-secondary)]"
                >
                  {u.active ? "Deactivate" : "Reactivate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
