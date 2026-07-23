import type { ReactNode } from "react";
import type { AlertStatus } from "../types";

const ALERT_STATUS_META: Record<AlertStatus, { variant: string; label: string; icon: string }> = {
  new: { variant: "warning", label: "New", icon: "exclamation-triangle-fill" },
  reviewed: { variant: "success", label: "Reviewed", icon: "check-circle-fill" },
  dismissed: { variant: "secondary", label: "Dismissed", icon: "x-circle" },
};

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const meta = ALERT_STATUS_META[status];
  return (
    <span className={`badge text-bg-${meta.variant}`}>
      <i className={`bi bi-${meta.icon} me-1`}></i>
      {meta.label}
    </span>
  );
}

export function ActiveStatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`badge text-bg-${active ? "success" : "secondary"}`}>
      <i className={`bi bi-${active ? "check-circle-fill" : "dash-circle"} me-1`}></i>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="badge text-bg-primary">{children}</span>;
}
