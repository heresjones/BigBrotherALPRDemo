import type { ReactNode } from "react";
import type { AlprRecord } from "../types";
import { formatLocation, formatTimestamp } from "../utils/format";

export function RecordCard({ record, footer }: { record: AlprRecord; footer?: ReactNode }) {
  return (
    <div className="col-lg-3 col-md-4 col-6">
      <div className="card mb-4">
        <img
          src={record.imageUrl}
          alt={record.plateText ?? "Unreadable plate"}
          className="card-img-top record-card-img"
        />
        <div className="card-body">
          <h5 className="font-monospace-lg d-flex align-items-center gap-2 mb-2">
            {record.plateText ?? "Unreadable"}
            {record.plateConfidence !== null && (
              <small className="text-body-secondary fw-normal fs-6">{Math.round(record.plateConfidence * 100)}%</small>
            )}
          </h5>
          <div className="small">
            {(
              [
                ["Vehicle", `${record.vehicleColor ?? "Unknown"} ${record.vehicleType ?? "vehicle"}`],
                ["Make/model", "Unknown"],
                ["Captured", formatTimestamp(record.capturedAt)],
                ["Location", formatLocation(record.latitude, record.longitude)],
              ] as const
            ).map(([label, value]) => (
              <div className="d-flex justify-content-between gap-2 py-1 border-bottom" key={label}>
                <span className="text-body-secondary text-nowrap">{label}</span>
                <span className="text-end">{value}</span>
              </div>
            ))}
          </div>
          {footer && <div className="mt-2 pt-2 border-top">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
