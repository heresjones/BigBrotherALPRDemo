import { useMemo, useState, type FormEvent } from "react";
import { useAppData } from "../context/AppDataContext";
import { RecordCard } from "../components/RecordCard";
import { PageHeader, PageContent } from "../components/Page";
import type { AlprRecord, SearchFilters } from "../types";

const EMPTY_FILTERS: SearchFilters = {};

function filterRecords(records: AlprRecord[], filters: SearchFilters): AlprRecord[] {
  return records.filter((r) => {
    if (filters.plateText && !r.plateText?.toUpperCase().includes(filters.plateText.toUpperCase())) return false;
    if (filters.color && r.vehicleColor !== filters.color) return false;
    if (filters.vehicleType && r.vehicleType !== filters.vehicleType) return false;
    if (filters.dateFrom && r.capturedAt.slice(0, 10) < filters.dateFrom) return false;
    if (filters.dateTo && r.capturedAt.slice(0, 10) > filters.dateTo) return false;
    return true;
  });
}

export default function VehicleSearchPage() {
  const { records, logSearch } = useAppData();
  const colors = useMemo(
    () => Array.from(new Set(records.map((r) => r.vehicleColor).filter(Boolean))) as string[],
    [records],
  );
  const types = useMemo(
    () => Array.from(new Set(records.map((r) => r.vehicleType).filter(Boolean))) as string[],
    [records],
  );

  const [draft, setDraft] = useState<SearchFilters>(EMPTY_FILTERS);
  const [reason, setReason] = useState("");
  const [applied, setApplied] = useState<SearchFilters>(EMPTY_FILTERS);
  const [hasSearched, setHasSearched] = useState(false);

  const results = useMemo(
    () => (hasSearched ? filterRecords(records, applied) : records),
    [records, applied, hasSearched],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApplied(draft);
    setHasSearched(true);
    const filtered = filterRecords(records, draft);
    logSearch(draft, reason || undefined, filtered.length);
  }

  function handleReset() {
    setDraft(EMPTY_FILTERS);
    setReason("");
    setApplied(EMPTY_FILTERS);
    setHasSearched(false);
  }

  return (
    <>
      <PageHeader
        title="Vehicle Search"
        lead="Search records by plate, vehicle attributes, and time range. Every search is logged — see Insights & Audit."
      />
      <PageContent>
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label">Plate (full or partial)</label>
                <input
                  type="text"
                  value={draft.plateText ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, plateText: e.target.value || undefined }))}
                  placeholder="e.g. 7ABC"
                  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Vehicle color</label>
                <select
                  value={draft.color ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value || undefined }))}
                  className="form-select"
                >
                  <option value="">Any</option>
                  {colors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Vehicle type</label>
                <select
                  value={draft.vehicleType ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, vehicleType: e.target.value || undefined }))}
                  className="form-select"
                >
                  <option value="">Any</option>
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">From</label>
                <input
                  type="date"
                  value={draft.dateFrom ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, dateFrom: e.target.value || undefined }))}
                  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">To</label>
                <input
                  type="date"
                  value={draft.dateTo ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, dateTo: e.target.value || undefined }))}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Reason for search (optional in demo)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Follow-up on theft report #4471"
                  className="form-control"
                />
              </div>
              <div className="col-md-3 d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-search me-1"></i>
                  Search
                </button>
                <button type="button" onClick={handleReset} className="btn btn-outline-secondary">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-body-secondary">
          {hasSearched
            ? `${results.length} result${results.length === 1 ? "" : "s"}`
            : `Showing all ${records.length} records — apply filters and search to log a query`}
        </p>

        <div className="row">
          {results.map((r) => (
            <RecordCard key={r.recordId} record={r} />
          ))}
          {results.length === 0 && <p className="text-body-secondary">No records match these filters.</p>}
        </div>
      </PageContent>
    </>
  );
}
