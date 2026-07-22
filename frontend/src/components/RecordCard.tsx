import type { ReactNode } from "react";
import type { AlprRecord } from "../types";
import { formatLocation, formatTimestamp } from "../utils/format";

export function RecordCard({ record, footer }: { record: AlprRecord; footer?: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)]">
      <img src={record.imageUrl} alt={record.plateText ?? "Unreadable plate"} className="block w-full" />
      <div className="p-3">
        <div className="flex items-center gap-2 font-mono text-lg font-bold text-[var(--text-primary)]">
          {record.plateText ?? "Unreadable"}
          {record.plateConfidence !== null && (
            <span className="text-xs font-normal text-[var(--text-muted)]">{Math.round(record.plateConfidence * 100)}%</span>
          )}
        </div>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-sm">
          <dt className="text-[var(--text-muted)]">Vehicle</dt>
          <dd className="text-[var(--text-secondary)]">
            {record.vehicleColor ?? "Unknown"} {record.vehicleType ?? "vehicle"}
          </dd>
          <dt className="text-[var(--text-muted)]">Make/model</dt>
          <dd className="text-[var(--text-secondary)]">Unknown</dd>
          <dt className="text-[var(--text-muted)]">Captured</dt>
          <dd className="text-[var(--text-secondary)]">{formatTimestamp(record.capturedAt)}</dd>
          <dt className="text-[var(--text-muted)]">Location</dt>
          <dd className="text-[var(--text-secondary)]">{formatLocation(record.latitude, record.longitude)}</dd>
        </dl>
        {footer && <div className="mt-3 border-t border-[var(--border-hairline)] pt-2">{footer}</div>}
      </div>
    </div>
  );
}
