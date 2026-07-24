import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { AlprRecord } from "../types";
import { useAppData } from "../context/AppDataContext";
import { formatLocation, formatTimestamp } from "../utils/format";
import { VehiclePhoto } from "./VehiclePhoto";

export function RecordCard({ record, footer }: { record: AlprRecord; footer?: ReactNode }) {
  const { activeDeviationPlates } = useAppData();
  const hasDeviationAlert = record.plateText !== null && activeDeviationPlates.has(record.plateText);

  return (
    <div className="col-lg-3 col-md-4 col-6">
      <div className="card mb-4">
        {hasDeviationAlert && (
          <span className="badge text-bg-danger position-absolute top-0 end-0 m-2" style={{ zIndex: 1000 }}>
            <i className="bi bi-exclamation-triangle-fill me-1"></i>
            Deviation
          </span>
        )}
        <VehiclePhoto src={record.imageUrl} plateText={record.plateText} alt={record.plateText ?? "Unreadable plate"} />
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
          <div className="mt-2 pt-2 border-top">
            <Link to={`/map/${record.recordId}`} className="btn btn-outline-secondary btn-sm w-100">
              <i className="bi bi-geo-alt me-1"></i>
              View on map
            </Link>
          </div>
          {footer && <div className="mt-2 pt-2 border-top">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
