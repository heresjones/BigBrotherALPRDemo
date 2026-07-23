import { useAppData } from "../context/AppDataContext";
import { ActiveStatusBadge, Pill } from "../components/Badge";
import { RoleGate } from "../components/RoleGate";
import { PageHeader, PageContent } from "../components/Page";

export default function UsersRolesPage() {
  return (
    <>
      <PageHeader
        title="Users & Roles"
        lead="Fixed demo roles: Admin (full access), Investigator (search, alerts, investigations), Viewer (read-only search)."
      />
      <PageContent>
        <RoleGate allow={["Admin"]}>
          <UsersTable />
        </RoleGate>
      </PageContent>
    </>
  );
}

function UsersTable() {
  const { users, toggleUserActive } = useAppData();
  return (
    <div className="card">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td className="text-body-secondary">{u.email}</td>
                  <td>
                    <Pill>{u.role}</Pill>
                  </td>
                  <td>
                    <ActiveStatusBadge active={u.active} />
                  </td>
                  <td>
                    <button onClick={() => toggleUserActive(u.id)} className="btn btn-outline-secondary btn-sm">
                      {u.active ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
