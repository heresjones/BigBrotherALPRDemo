import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import type { AlprRecord, Camera } from "../types";
import { formatTimestamp } from "../utils/format";

// Fixed categorical order — never cycled/reassigned per render.
export const PLATE_COLORS = ["#0d6efd", "#fd7e14", "#20c997", "#6f42c1"];

export interface DetectionGroup {
  plate: string;
  color: string;
  records: AlprRecord[];
}

// Sequential single-hue ramp (magnitude encoding) — none/low/med/high/very high.
const FREQ_COLORS = ["#adb5bd", "#93c5fd", "#60a5fa", "#2563eb", "#1e3a8a"];
const FREQ_SIZES = [16, 20, 24, 28, 32];

function frequencyStep(count: number, max: number): number {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

function cameraIcon(count: number, max: number): L.DivIcon {
  const step = frequencyStep(count, max);
  const size = FREQ_SIZES[step];
  const color = FREQ_COLORS[step];
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 0 2px #fff;
    "><i class="bi bi-camera-video-fill" style="color:#fff;font-size:${Math.round(size * 0.5)}px;"></i></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function deviationIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:40px;height:40px;border-radius:50%;
      border:3px solid #dc3545;
      display:flex;align-items:center;justify-content:center;
      background:rgba(220,53,69,0.18);
      box-shadow:0 0 0 2px #fff;
    "><i class="bi bi-exclamation-triangle-fill" style="color:#dc3545;font-size:15px;"></i></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function FlyToRecord({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 15, { duration: 0.6 });
  }, [target, map]);
  return null;
}

function FitToPoints({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    } else if (points.length === 1) {
      map.setView(points[0], 14);
    }
    // Only fit once, on mount for this map instance — subsequent timeline
    // clicks should fly, not re-fit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function DetectionMap({
  groups,
  cameras,
  focusedRecordId,
  cameraFrequency = {},
  rangeLabel,
  deviationRecordIds,
  height = 480,
}: {
  groups: DetectionGroup[];
  cameras: Camera[];
  focusedRecordId?: string | null;
  cameraFrequency?: Record<string, number>;
  rangeLabel?: string;
  deviationRecordIds?: Set<string>;
  height?: number;
}) {
  const located = useMemo(
    () =>
      groups.map((g) => ({
        ...g,
        records: g.records.filter(
          (r): r is AlprRecord & { latitude: number; longitude: number } =>
            r.latitude !== null && r.longitude !== null,
        ),
      })),
    [groups],
  );

  const maxFrequency = useMemo(() => Math.max(...Object.values(cameraFrequency), 1), [cameraFrequency]);

  const allPoints = useMemo<[number, number][]>(
    () => located.flatMap((g) => g.records.map((r) => [r.latitude, r.longitude] as [number, number])),
    [located],
  );

  const center: [number, number] =
    allPoints.length > 0
      ? [
          allPoints.reduce((s, p) => s + p[0], 0) / allPoints.length,
          allPoints.reduce((s, p) => s + p[1], 0) / allPoints.length,
        ]
      : [34.05, -118.25];

  const focusTarget = useMemo<[number, number] | null>(() => {
    if (!focusedRecordId) return null;
    for (const g of located) {
      const r = g.records.find((rec) => rec.recordId === focusedRecordId);
      if (r) return [r.latitude, r.longitude];
    }
    return null;
  }, [focusedRecordId, located]);

  return (
    <div style={{ height, width: "100%" }} className="rounded overflow-hidden border">
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cameras.map((cam) => {
          const count = cameraFrequency[cam.id] ?? 0;
          return (
            <Marker key={cam.id} position={[cam.latitude, cam.longitude]} icon={cameraIcon(count, maxFrequency)}>
              <Popup>
                <strong>{cam.name}</strong>
                <br />
                {count > 0
                  ? `${count} detection${count === 1 ? "" : "s"}${rangeLabel ? ` in the last ${rangeLabel}` : ""}`
                  : "No detections in this range"}
              </Popup>
            </Marker>
          );
        })}

        {located.map(
          (g) =>
            g.records.length > 1 && (
              <Polyline
                key={`path-${g.plate}`}
                positions={g.records.map((r) => [r.latitude, r.longitude])}
                pathOptions={{ color: g.color, weight: 3, opacity: 0.8, dashArray: "6 8" }}
              />
            ),
        )}

        {located.map((g) =>
          g.records.map((r, i) => {
            const isDeviation = deviationRecordIds?.has(r.recordId) ?? false;
            return (
              <CircleMarker
                key={r.recordId}
                center={[r.latitude, r.longitude]}
                radius={r.recordId === focusedRecordId ? 11 : isDeviation ? 9 : 7}
                pathOptions={{
                  color: "#fff",
                  weight: 2,
                  fillColor: isDeviation ? "#dc3545" : g.color,
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  {isDeviation && (
                    <div className="text-danger fw-semibold mb-1">
                      <i className="bi bi-exclamation-triangle-fill me-1"></i>
                      Flagged deviation
                    </div>
                  )}
                  <strong>{g.plate}</strong> — stop {i + 1}
                  <br />
                  {formatTimestamp(r.capturedAt)}
                  <br />
                  {cameras.find((c) => c.id === r.cameraId)?.name ?? "Unknown camera"}
                </Popup>
              </CircleMarker>
            );
          }),
        )}

        {located.map((g) =>
          g.records
            .filter((r) => deviationRecordIds?.has(r.recordId))
            .map((r) => (
              <Marker
                key={`deviation-${r.recordId}`}
                position={[r.latitude, r.longitude]}
                icon={deviationIcon()}
                zIndexOffset={1000}
              >
                <Popup>
                  <div className="text-danger fw-semibold mb-1">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                    Flagged deviation
                  </div>
                  <strong>{g.plate}</strong>
                  <br />
                  {formatTimestamp(r.capturedAt)}
                  <br />
                  {cameras.find((c) => c.id === r.cameraId)?.name ?? "Unknown camera"}
                </Popup>
              </Marker>
            )),
        )}

        <FitToPoints points={allPoints} />
        <FlyToRecord target={focusTarget} />
      </MapContainer>
    </div>
  );
}
