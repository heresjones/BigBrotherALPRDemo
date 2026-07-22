import type { ReactNode } from "react";
import { useAppData } from "../context/AppDataContext";
import type { UserRole } from "../types";

export function RoleGate({ allow, children }: { allow: UserRole[]; children: ReactNode }) {
  const { currentUser } = useAppData();
  if (!allow.includes(currentUser.role)) {
    return (
      <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-6 text-sm text-[var(--text-secondary)]">
        <div className="font-medium text-[var(--text-primary)]">Restricted</div>
        <p className="mt-1">
          This section requires the {allow.join(" or ")} role. You're acting as <strong>{currentUser.name}</strong> ({currentUser.role}).
          Switch roles from "Acting as" in the top bar to preview it.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
