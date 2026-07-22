import { NavLink } from "react-router-dom";

interface NavItem {
  label: string;
  path: string;
  tier: "demo" | "vision" | "vision-mock";
}

// Mirrors the 11-module IA from docs/PRD.md §6. "vision" items have no page
// at all (no camera hardware, no live video in this demo); "vision-mock" is
// Sharing, which PRD §7.8 calls for as an illustrative-only mock.
export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", path: "/", tier: "demo" },
  { label: "Live Map", path: "/live-map", tier: "vision" },
  { label: "Vehicle Search", path: "/search", tier: "demo" },
  { label: "Video", path: "/video", tier: "vision" },
  { label: "Alerts", path: "/alerts", tier: "demo" },
  { label: "Investigations", path: "/investigations", tier: "demo" },
  { label: "Cameras & Health", path: "/cameras", tier: "vision" },
  { label: "Sharing", path: "/sharing", tier: "vision-mock" },
  { label: "Insights & Audit", path: "/audit", tier: "demo" },
  { label: "Users & Roles", path: "/users", tier: "demo" },
  { label: "Organization Settings", path: "/settings", tier: "demo" },
];

export function Sidebar() {
  return (
    <nav className="flex h-full w-64 shrink-0 flex-col border-r border-[var(--border-hairline)] bg-[var(--surface-1)] p-3">
      <div className="mb-4 px-2 pt-1">
        <div className="text-sm font-semibold text-[var(--text-primary)]">BigBrotherALPRDemo</div>
        <div className="text-xs text-[var(--text-muted)]">ALPR investigations platform</div>
      </div>
      <ul className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            {item.tier === "vision" ? (
              <span
                className="flex cursor-not-allowed items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-[var(--text-muted)]"
                title="Modeled in the PRD as a vision-tier capability; not built in this demo"
              >
                {item.label}
                <span className="rounded-full border border-[var(--border-hairline)] px-1.5 py-0.5 text-[10px] tracking-wide uppercase">
                  Vision
                </span>
              </span>
            ) : (
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm ${
                    isActive
                      ? "bg-[var(--accent-wash)] font-medium text-[var(--series-1)]"
                      : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`
                }
              >
                {item.label}
                {item.tier === "vision-mock" && (
                  <span className="rounded-full border border-[var(--border-hairline)] px-1.5 py-0.5 text-[10px] tracking-wide text-[var(--text-muted)] uppercase">
                    Mock
                  </span>
                )}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
