import { useMemo, useState, type FormEvent } from "react";
import { useAppData } from "../context/AppDataContext";
import { RecordCard } from "../components/RecordCard";
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
    <div>
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Vehicle Search</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Search records by plate, vehicle attributes, and time range. Every search is logged — see Insights &amp; Audit.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-4 grid gap-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Plate (full or partial)</span>
          <input
            type="text"
            value={draft.plateText ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, plateText: e.target.value || undefined }))}
            placeholder="e.g. 7ABC"
            className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Vehicle color</span>
          <select
            value={draft.color ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value || undefined }))}
            className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
          >
            <option value="">Any</option>
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--text-secondary)]">Vehicle type</span>
          <select
            value={draft.vehicleType ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, vehicleType: e.target.value || undefined }))}
            className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
          >
            <option value="">Any</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-secondary)]">From</span>
            <input
              type="date"
              value={draft.dateFrom ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, dateFrom: e.target.value || undefined }))}
              className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-secondary)]">To</span>
            <input
              type="date"
              value={draft.dateTo ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, dateTo: e.target.value || undefined }))}
              className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2 lg:col-span-3">
          <span className="text-[var(--text-secondary)]">Reason for search (optional in demo)</span>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Follow-up on theft report #4471"
            className="rounded-md border border-[var(--border-hairline)] bg-transparent px-2 py-1.5"
          />
        </label>
        <div className="flex items-end gap-2">
          <button type="submit" className="rounded-md bg-[var(--series-1)] px-3 py-1.5 text-sm font-medium text-white">
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-[var(--border-hairline)] px-3 py-1.5 text-sm text-[var(--text-secondary)]"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-4 text-sm text-[var(--text-muted)]">
        {hasSearched
          ? `${results.length} result${results.length === 1 ? "" : "s"}`
          : `Showing all ${records.length} records — apply filters and search to log a query`}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {results.map((r) => (
          <RecordCard key={r.recordId} record={r} />
        ))}
        {results.length === 0 && <p className="text-sm text-[var(--text-muted)]">No records match these filters.</p>}
      </div>
    </div>
  );
}
