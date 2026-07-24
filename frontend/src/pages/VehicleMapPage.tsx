import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { PageHeader, PageContent } from "../components/Page";
import { DetectionMap, PLATE_COLORS } from "../components/DetectionMap";
import { ClaimBadge } from "../components/ClaimBadge";
import { FrequencyChart } from "../components/FrequencyChart";
import { owners } from "../data/owners";
import { people } from "../data/people";
import { formatTimestamp, formatDate } from "../utils/format";
import {
  generateDetectionHistory,
  filterByRange,
  bucketDetections,
  summarizePatterns,
  hourBucketLabel,
  type HistoricalDetection,
} from "../utils/detectionHistory";
import { severityOf, scoreThreshold, type Severity } from "../utils/deviations";

const SEVERITY_BADGE: Record<Severity, string> = {
  high: "text-bg-danger",
  medium: "text-bg-warning",
  low: "text-bg-secondary",
};

const RANGE_OPTIONS = [
  { label: "24h", days: 1 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "1y", days: 365 },
];

export default function VehicleMapPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const {
    records,
    cameras,
    deviationSensitivity,
    setDeviationSensitivity,
    deviationWatchlist,
    toggleDeviationWatch,
    deviationsByPlate,
    activeDeviationPlates,
  } = useAppData();
  const [focusedRecordId, setFocusedRecordId] = useState<string | null>(recordId ?? null);
  const [rangeDays, setRangeDays] = useState(30);
  const now = useMemo(() => new Date(), []);

  const record = records.find((r) => r.recordId === recordId);

  const related = useMemo(() => {
    if (!record) return [];
    if (!record.plateText) return [record];
    return records
      .filter((r) => r.plateText === record.plateText)
      .slice()
      .sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
  }, [records, record]);

  const history = useMemo(() => {
    if (!record?.plateText) return [];
    return generateDetectionHistory(record.plateText, cameras, now);
  }, [record?.plateText, cameras, now]);

  const combined = useMemo<HistoricalDetection[]>(() => {
    const real = related
      .filter((r) => r.cameraId !== null)
      .map((r) => ({ id: r.recordId, capturedAt: r.capturedAt, cameraId: r.cameraId as string }));
    return [...history, ...real].sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
  }, [history, related]);

  const filtered = useMemo(() => filterByRange(combined, rangeDays, now), [combined, rangeDays, now]);
  const buckets = useMemo(() => bucketDetections(filtered, rangeDays, now), [filtered, rangeDays, now]);
  const patterns = useMemo(() => summarizePatterns(filtered, cameras), [filtered, cameras]);
  const rangeLabel = RANGE_OPTIONS.find((o) => o.days === rangeDays)?.label ?? `${rangeDays}d`;

  if (!record) {
    return (
      <>
        <PageHeader title="Record not found" />
        <PageContent>
          <Link to="/search" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Vehicle Search
          </Link>
        </PageContent>
      </>
    );
  }

  const located = related.filter((r) => r.latitude !== null && r.longitude !== null);
  const missingCount = related.length - located.length;
  const camerasVisited = new Set(located.map((r) => r.cameraId).filter(Boolean)).size;
  const first = related[0];
  const last = related[related.length - 1];
  const owner = record.plateText ? owners[record.plateText] : undefined;
  const ownerPerson = owner ? people[owner.personId] : undefined;

  const plateDeviations = record.plateText ? (deviationsByPlate[record.plateText] ?? []) : [];
  const isWatched = record.plateText ? deviationWatchlist[record.plateText] !== false : false;
  const deviationThreshold = scoreThreshold(deviationSensitivity);
  const flaggedDeviations = isWatched ? plateDeviations.filter((d) => d.score >= deviationThreshold) : [];
  const hasActiveAlert = record.plateText ? activeDeviationPlates.has(record.plateText) : false;
  const deviationRecordIds = new Set(flaggedDeviations.map((d) => d.recordId));

  return (
    <>
      <PageHeader
        title={record.plateText ? `Vehicle Profile — ${record.plateText}` : "Vehicle Profile — Unreadable plate"}
        lead={
          related.length > 1
            ? `${related.length} detections across ${camerasVisited} camera${camerasVisited === 1 ? "" : "s"}, ${formatTimestamp(first.capturedAt)} – ${formatTimestamp(last.capturedAt)}`
            : "Single detection — no other sightings of this plate in the case-file dataset."
        }
      />
      <PageContent>
        <Link to="/search" className="btn btn-outline-secondary btn-sm mb-3">
          <i className="bi bi-arrow-left me-1"></i>
          Back to Vehicle Search
        </Link>

        <div className="card mb-4">
          <div className="card-body d-flex flex-wrap gap-4 align-items-center">
            <img
              src={record.imageUrl}
              alt={record.plateText ?? "Unreadable plate"}
              style={{ width: 160, height: 110, objectFit: "cover" }}
              className="rounded border"
            />
            <div className="d-flex flex-wrap gap-4">
              <div>
                <div className="text-body-secondary small">Plate</div>
                <div className="d-flex align-items-center gap-2">
                  <span className="font-monospace-lg">{record.plateText ?? "Unreadable"}</span>
                  {hasActiveAlert && (
                    <span className="badge text-bg-danger">
                      <i className="bi bi-exclamation-triangle-fill me-1"></i>
                      Deviation
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-body-secondary small">Vehicle</div>
                <div>
                  {record.vehicleColor ?? "Unknown"} {record.vehicleType ?? "vehicle"}
                </div>
              </div>
              <div>
                <div className="text-body-secondary small">OCR confidence</div>
                <div>{record.plateConfidence !== null ? `${Math.round(record.plateConfidence * 100)}%` : "—"}</div>
              </div>
              <div>
                <div className="text-body-secondary small">First seen</div>
                <div>{formatDate(first.capturedAt)}</div>
              </div>
              <div>
                <div className="text-body-secondary small">Last seen</div>
                <div>{formatDate(last.capturedAt)}</div>
              </div>
              <div>
                <div className="text-body-secondary small">Case-file detections</div>
                <div>{related.length}</div>
              </div>
            </div>
          </div>
        </div>

        {missingCount > 0 && (
          <div className="alert alert-secondary">
            <i className="bi bi-info-circle me-2"></i>
            {missingCount} of {related.length} detection{missingCount === 1 ? "" : "s"} have no location data and
            {missingCount === 1 ? " is" : " are"} not shown on the map.
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
          <h3 className="fs-5 mb-0">Detection map &amp; camera frequency</h3>
          <div className="btn-group btn-group-sm" role="group" aria-label="Time range">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setRangeDays(opt.days)}
                className={`btn ${rangeDays === opt.days ? "btn-primary" : "btn-outline-primary"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-body-secondary small">
          Camera marker size and color reflect how often this vehicle was detected there in the selected range.
          The dashed line and numbered dots are the actual case-file detections listed in the Timeline.
          {flaggedDeviations.length > 0 && " Red dots are flagged deviations — see the Deviations panel below."}
        </p>

        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4" style={{ maxHeight: 480, overflowY: "auto" }}>
              <div className="card-header">
                <h3 className="card-title">Timeline</h3>
              </div>
              <div className="list-group list-group-flush">
                {related.map((r, i) => (
                  <button
                    key={r.recordId}
                    type="button"
                    onClick={() => setFocusedRecordId(r.recordId)}
                    disabled={r.latitude === null}
                    className={`list-group-item list-group-item-action ${r.recordId === focusedRecordId ? "active" : ""}`}
                  >
                    <div className="d-flex justify-content-between">
                      <span>Stop {i + 1}</span>
                      <span className="small">{formatTimestamp(r.capturedAt)}</span>
                    </div>
                    <div className="small text-body-secondary">
                      {cameras.find((c) => c.id === r.cameraId)?.name ?? "Unknown / no location"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <DetectionMap
              key={record.plateText ?? record.recordId}
              groups={[{ plate: record.plateText ?? "Unreadable", color: PLATE_COLORS[0], records: related }]}
              cameras={cameras}
              focusedRecordId={focusedRecordId}
              cameraFrequency={patterns?.byCamera}
              rangeLabel={rangeLabel}
              deviationRecordIds={deviationRecordIds}
              height={480}
            />
          </div>
        </div>

        <div className="accordion mb-4" id="vehicleProfileAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOwner">
                <i className="bi bi-person-vcard me-2"></i>
                Registration &amp; owner
              </button>
            </h2>
            <div id="collapseOwner" className="accordion-collapse collapse show" data-bs-parent="#vehicleProfileAccordion">
              <div className="accordion-body">
                {owner ? (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      {ownerPerson && (
                        <img
                          src={ownerPerson.photoUrl}
                          alt={`License photo of ${owner.ownerName}`}
                          style={{ width: 64, height: 64, objectFit: "cover" }}
                          className="rounded border"
                        />
                      )}
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <ClaimBadge level="external" />
                          <span className="text-body-secondary small">State vehicle registration lookup</span>
                        </div>
                        <Link to={`/person/${owner.personId}`} className="fw-semibold fs-6 text-decoration-none">
                          {owner.ownerName}
                        </Link>
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-sm-6 col-lg-4">
                        <div className="text-body-secondary small">Address on file</div>
                        <div>
                          {owner.streetAddress}
                          <br />
                          {owner.city}, {owner.state} {owner.zip}
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-4">
                        <div className="text-body-secondary small">Registration expires</div>
                        <div>{formatDate(owner.registrationExpires)}</div>
                      </div>
                    </div>

                    {ownerPerson && ownerPerson.householdIds.length > 0 && (
                      <div className="mb-3">
                        <div className="text-body-secondary small mb-2">
                          Possible roommate{ownerPerson.householdIds.length === 1 ? "" : "s"} — same address on file
                        </div>
                        <div className="d-flex flex-wrap gap-3">
                          {ownerPerson.householdIds.map((id) => {
                            const roommate = people[id];
                            if (!roommate) return null;
                            return (
                              <Link
                                key={id}
                                to={`/person/${id}`}
                                className="d-flex align-items-center gap-2 text-decoration-none"
                              >
                                <img
                                  src={roommate.photoUrl}
                                  alt={`License photo of ${roommate.name}`}
                                  style={{ width: 40, height: 40, objectFit: "cover" }}
                                  className="rounded-circle border"
                                />
                                <span>{roommate.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="alert alert-warning mb-0">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      This is the <strong>registered owner</strong>, not a confirmed driver. See{" "}
                      <Link to="/demos/owner-vs-driver">Owner vs. Driver</Link> for why that distinction matters.
                    </div>
                  </>
                ) : (
                  <p className="text-body-secondary mb-0">
                    {record.plateText
                      ? "No DMV registration match found for this plate."
                      : "Plate could not be read — no registration lookup is possible."}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapsePatterns"
              >
                <i className="bi bi-robot me-2"></i>
                AI pattern summary
              </button>
            </h2>
            <div id="collapsePatterns" className="accordion-collapse collapse" data-bs-parent="#vehicleProfileAccordion">
              <div className="accordion-body">
                {patterns ? (
                  <>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <ClaimBadge level="inferred" />
                      <span className="text-body-secondary small">
                        Generated from {patterns.total} detection{patterns.total === 1 ? "" : "s"} across the camera
                        network in the last {rangeLabel}
                      </span>
                    </div>

                    <FrequencyChart buckets={buckets} />

                    <ul className="mt-3 mb-3">
                      {patterns.topCamera && (
                        <li>
                          Most frequently detected at <strong>{patterns.topCamera.name}</strong> (
                          {patterns.topCameraShare}% of detections in this range).
                        </li>
                      )}
                      <li>
                        {patterns.weekdayShare}% of detections occur on weekdays, {patterns.weekendShare}% on weekends.
                      </li>
                      <li>Most commonly detected in the {hourBucketLabel(patterns.topHourBucket)}.</li>
                    </ul>

                    <div className="alert alert-secondary mb-0">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      This summary is generated from detection frequency alone. It does not confirm identity,
                      purpose, or who was driving.
                    </div>
                  </>
                ) : (
                  <p className="text-body-secondary mb-0">No detections in the selected range.</p>
                )}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseDeviations"
              >
                <i className="bi bi-shield-exclamation me-2"></i>
                Deviations
                {hasActiveAlert && <span className="badge text-bg-danger ms-2">{flaggedDeviations.length}</span>}
              </button>
            </h2>
            <div id="collapseDeviations" className="accordion-collapse collapse" data-bs-parent="#vehicleProfileAccordion">
              <div className="accordion-body">
                {record.plateText ? (
                  <>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="deviation-watch"
                        checked={isWatched}
                        onChange={() => toggleDeviationWatch(record.plateText as string)}
                      />
                      <label className="form-check-label" htmlFor="deviation-watch">
                        Alert me if this vehicle deviates from its normal pattern
                      </label>
                    </div>

                    <label htmlFor="deviation-sensitivity" className="form-label mb-1">
                      Deviation sensitivity <span className="text-body-secondary">(applies to all vehicles)</span>
                    </label>
                    <input
                      id="deviation-sensitivity"
                      type="range"
                      className="form-range mb-1"
                      min={0}
                      max={100}
                      step={5}
                      value={deviationSensitivity}
                      onChange={(e) => setDeviationSensitivity(Number(e.target.value))}
                    />
                    <div className="d-flex justify-content-between small text-body-secondary mb-3">
                      <span>Low — only very obvious deviations</span>
                      <span>High — flags subtle ones too</span>
                    </div>

                    {!isWatched ? (
                      <p className="text-body-secondary mb-0">
                        Deviation alerts are off for this plate — turn on the switch above to see flagged events.
                      </p>
                    ) : plateDeviations.length === 0 ? (
                      <p className="text-body-secondary mb-0">
                        No deviation candidates for this vehicle — either too few sightings, or every sighting fits
                        its established routine.
                      </p>
                    ) : flaggedDeviations.length === 0 ? (
                      <p className="text-body-secondary mb-0">
                        {plateDeviations.length} potential deviation{plateDeviations.length === 1 ? "" : "s"}{" "}
                        {plateDeviations.length === 1 ? "exists" : "exist"} for this vehicle but scored below the
                        current sensitivity threshold. Raise sensitivity to review.
                      </p>
                    ) : (
                      <>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <ClaimBadge level="inferred" />
                          <span className="text-body-secondary small">
                            {flaggedDeviations.length} flagged deviation{flaggedDeviations.length === 1 ? "" : "s"} at
                            the current sensitivity
                          </span>
                        </div>
                        <div className="list-group">
                          {flaggedDeviations.map((d) => {
                            const severity = severityOf(d.score);
                            return (
                              <div key={d.recordId} className="list-group-item">
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                                  <span className="fw-semibold">{formatTimestamp(d.capturedAt)}</span>
                                  <span className={`badge ${SEVERITY_BADGE[severity]}`}>
                                    {severity} severity ({d.score})
                                  </span>
                                </div>
                                <div className="text-body-secondary small mb-2">
                                  {cameras.find((c) => c.id === d.cameraId)?.name ?? "Unknown camera"}
                                </div>
                                <ul className="small mb-2">
                                  {d.reasons.map((reason) => (
                                    <li key={reason}>{reason}</li>
                                  ))}
                                </ul>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => setFocusedRecordId(d.recordId)}
                                >
                                  <i className="bi bi-geo-alt me-1"></i>
                                  View on map
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <div className="alert alert-secondary mt-3 mb-0">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          A deviation flag means this detection doesn't fit the vehicle's own recent history. It is
                          not evidence of wrongdoing.
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-body-secondary mb-0">Plate could not be read — no pattern to compare against.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}
