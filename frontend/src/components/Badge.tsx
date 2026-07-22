import type { ReactNode } from "react";
import type { AlertStatus } from "../types";

// Status colors are reserved for real state signals and always ship as a
// dot + label, never color alone or color-on-text (dataviz skill, status
// palette rule).
function Dot({ color }: { color: string }) {
  return <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />;
}

export function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
      <Dot color={color} />
      {label}
    </span>
  );
}

const ALERT_STATUS_META: Record<AlertStatus, { color: string; label: string }> = {
  new: { color: "var(--status-warning)", label: "New" },
  reviewed: { color: "var(--status-good)", label: "Reviewed" },
  dismissed: { color: "var(--text-muted)", label: "Dismissed" },
};

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const meta = ALERT_STATUS_META[status];
  return <StatusDot color={meta.color} label={meta.label} />;
}

export function ActiveStatusBadge({ active }: { active: boolean }) {
  return <StatusDot color={active ? "var(--status-good)" : "var(--text-muted)"} label={active ? "Active" : "Inactive"} />;
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border-hairline)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
      {children}
    </span>
  );
}
