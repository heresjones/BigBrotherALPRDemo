interface StatTileProps {
  label: string;
  value: string;
  delta?: { text: string; direction: "up" | "down"; goodDirection: "up" | "down" };
  trend?: number[];
}

export function StatTile({ label, value, delta, trend }: StatTileProps) {
  const deltaGood = delta ? delta.direction === delta.goodDirection : undefined;
  return (
    <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)] p-4">
      <div className="text-sm text-[var(--text-secondary)]">{label}</div>
      <div className="mt-1 flex items-end justify-between gap-3">
        <div className="text-3xl font-semibold text-[var(--text-primary)]">{value}</div>
        {trend && trend.length > 1 && <Sparkline points={trend} />}
      </div>
      {delta && (
        <div className="mt-1 text-xs font-medium" style={{ color: deltaGood ? "var(--status-good)" : "var(--status-critical)" }}>
          {delta.direction === "up" ? "▲" : "▼"} {delta.text}
        </div>
      )}
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const width = 72;
  const height = 24;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const coords = points.map((p, i) => [i * step, height - ((p - min) / range) * height] as const);
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lastX, lastY] = coords[coords.length - 1];
  return (
    <svg width={width} height={height} className="shrink-0" aria-hidden="true">
      <path d={path} fill="none" stroke="var(--text-muted)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r={3} fill="var(--series-1)" stroke="var(--surface-1)" strokeWidth={2} />
    </svg>
  );
}
