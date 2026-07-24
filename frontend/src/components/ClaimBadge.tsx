// The four claim levels every Scenario Library screen tags its facts with —
// see docs/DEMO_SCENARIOS.md §2. Deliberately fixed to four: a screen that
// blurs "observed" and "inferred" together is the exact failure mode this
// component exists to make visible.
export type ClaimLevel = "observed" | "estimated" | "inferred" | "external";

const CLAIM_META: Record<ClaimLevel, { label: string; variant: string; icon: string }> = {
  observed: { label: "Observed", variant: "primary", icon: "camera-fill" },
  estimated: { label: "Estimated", variant: "info", icon: "sliders" },
  inferred: { label: "Inferred", variant: "dark", icon: "diagram-3-fill" },
  external: { label: "Externally linked", variant: "warning", icon: "link-45deg" },
};

export function ClaimBadge({ level }: { level: ClaimLevel }) {
  const meta = CLAIM_META[level];
  return (
    <span className={`badge text-bg-${meta.variant}`}>
      <i className={`bi bi-${meta.icon} me-1`}></i>
      {meta.label}
    </span>
  );
}

export function ClaimLegend() {
  return (
    <div className="d-flex flex-wrap gap-3 small text-body-secondary mb-3">
      {(Object.keys(CLAIM_META) as ClaimLevel[]).map((level) => (
        <span key={level} className="d-flex align-items-center gap-1">
          <ClaimBadge level={level} />
        </span>
      ))}
    </div>
  );
}
