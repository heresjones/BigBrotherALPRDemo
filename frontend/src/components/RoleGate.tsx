import type { ReactNode } from "react";
import { useAppData } from "../context/AppDataContext";
import type { UserRole } from "../types";

export function RoleGate({ allow, children }: { allow: UserRole[]; children: ReactNode }) {
  const { currentUser } = useAppData();
  if (!allow.includes(currentUser.role)) {
    return (
      <div className="alert alert-secondary d-flex align-items-start" role="alert">
        <i className="bi bi-lock-fill me-2 mt-1"></i>
        <div>
          <strong>Restricted.</strong> This section requires the {allow.join(" or ")} role. You're acting as{" "}
          <strong>{currentUser.name}</strong> ({currentUser.role}). Switch roles from the user menu in the top bar to
          preview it.
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
