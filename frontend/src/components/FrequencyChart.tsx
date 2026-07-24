import type { FrequencyBucket } from "../utils/detectionHistory";

const LINE_COLOR = "#0d6efd";
const PEAK_COLOR = "#dc3545";
const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 36;

export function FrequencyChart({ buckets }: { buckets: FrequencyBucket[] }) {
  if (buckets.length === 0) return null;

  const max = Math.max(...buckets.map((b) => b.count), 1);
  const stepX = buckets.length > 1 ? VIEW_WIDTH / (buckets.length - 1) : 0;
  const points = buckets.map((b, i) => ({
    x: buckets.length > 1 ? i * stepX : VIEW_WIDTH / 2,
    y: VIEW_HEIGHT - 2 - (b.count / max) * (VIEW_HEIGHT - 6),
    ...b,
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  const peakCount = Math.max(...buckets.map((b) => b.count));

  // Show every Nth x-axis label so long ranges (e.g. 52 weekly buckets)
  // don't overlap.
  const labelStride = Math.max(1, Math.ceil(buckets.length / 8));

  return (
    <div>
      <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} preserveAspectRatio="none" style={{ width: "100%", height: 140 }}>
        <line
          x1={0}
          y1={VIEW_HEIGHT - 2}
          x2={VIEW_WIDTH}
          y2={VIEW_HEIGHT - 2}
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={0.4}
        />
        <path
          d={path}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((p) => (
          <circle
            key={`${p.label}-${p.x}`}
            cx={p.x}
            cy={p.y}
            r={peakCount > 0 && p.count === peakCount ? 1.8 : 0.9}
            fill={peakCount > 0 && p.count === peakCount ? PEAK_COLOR : LINE_COLOR}
          >
            <title>{`${p.label}: ${p.count} detection${p.count === 1 ? "" : "s"}`}</title>
          </circle>
        ))}
      </svg>
      <div className="d-flex justify-content-between small text-body-secondary mt-1">
        {points
          .filter((_, i) => i % labelStride === 0 || i === points.length - 1)
          .map((p) => (
            <span key={`label-${p.label}-${p.x}`}>{p.label}</span>
          ))}
      </div>
    </div>
  );
}
