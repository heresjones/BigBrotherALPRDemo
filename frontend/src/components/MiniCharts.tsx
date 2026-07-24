// Small inline visualizations for colored KPI cards. All draw in
// `currentColor` so they automatically match whatever contrasting text
// color Bootstrap's `.text-bg-{variant}` picked for that card — no need to
// hand-pick a palette per variant.

export function Sparkline({ values, title }: { values: number[]; title?: string }) {
  if (values.length === 0) return null;
  const w = 100;
  const h = 40;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = values.length > 1 ? w / (values.length - 1) : 0;
  const points = values.map((v, i) => ({
    x: values.length > 1 ? i * stepX : w / 2,
    y: h - ((v - min) / range) * (h - 8) - 4,
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  const area = `${line} L${last.x.toFixed(1)},${h} L${points[0].x.toFixed(1)},${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height: "100%", display: "block" }}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      <path d={area} fill="currentColor" opacity={0.22} />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last.x} cy={last.y} r={3.2} fill="currentColor" />
    </svg>
  );
}

export function MiniDonut({ percent, title }: { percent: number; title?: string }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = 15;
  const circumference = 2 * Math.PI * r;
  const dash = (clamped / 100) * circumference;

  return (
    <svg
      viewBox="0 0 36 36"
      style={{ width: "100%", height: "100%", display: "block" }}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      <circle cx={18} cy={18} r={r} fill="none" stroke="currentColor" strokeWidth={4} opacity={0.25} />
      {clamped > 0 && (
        <circle
          cx={18}
          cy={18}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          transform="rotate(-90 18 18)"
        />
      )}
      <text x={18} y={21} textAnchor="middle" fontSize={9} fontWeight={700} fill="currentColor">
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? "1" : "0";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

// A half-circle (180°) gauge — visually distinct from the full-circle donut.
export function RadialGauge({ percent, title }: { percent: number; title?: string }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const cx = 18;
  const cy = 19;
  const r = 14;
  const trackPath = describeArc(cx, cy, r, -90, 90);
  const valueAngle = -90 + (clamped / 100) * 180;
  const valuePath = describeArc(cx, cy, r, -90, valueAngle);

  return (
    <svg
      viewBox="0 0 36 26"
      style={{ width: "100%", height: "100%", display: "block" }}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      <path d={trackPath} fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" opacity={0.25} />
      {clamped > 0 && (
        <path d={valuePath} fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
      )}
      <text x={cx} y={cy + 1} textAnchor="middle" fontSize={9} fontWeight={700} fill="currentColor">
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}

export function MiniBars({ items }: { items: { label: string; value: number }[] }) {
  if (items.length === 0) return null;
  const w = 100;
  const h = 40;
  const gap = 8;
  const max = Math.max(...items.map((i) => i.value), 1);
  const barWidth = (w - gap * (items.length - 1)) / items.length;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
      {items.map((item, i) => {
        const barH = Math.max((item.value / max) * (h - 6), 4);
        const x = i * (barWidth + gap);
        return (
          <rect
            key={item.label}
            x={x}
            y={h - barH}
            width={barWidth}
            height={barH}
            rx={1.5}
            fill="currentColor"
            opacity={0.5 + 0.5 * (item.value / max)}
          >
            <title>{`${item.label}: ${item.value}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}
