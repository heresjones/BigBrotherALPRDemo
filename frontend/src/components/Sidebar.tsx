import { NavLink } from "react-router-dom";

interface NavItem {
  label: string;
  path: string;
  icon: string;
  tier: "demo" | "vision" | "vision-mock";
}

// Mirrors the 11-module IA from docs/PRD.md §6. "vision" items have no page
// at all (no camera hardware, no live video in this demo); "vision-mock" is
// Sharing, which PRD §7.8 calls for as an illustrative-only mock.
export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", path: "/", icon: "speedometer", tier: "demo" },
  { label: "Live Map", path: "/live-map", icon: "geo-alt", tier: "vision" },
  { label: "Vehicle Search", path: "/search", icon: "search", tier: "demo" },
  { label: "Video", path: "/video", icon: "camera-video", tier: "vision" },
  { label: "Alerts", path: "/alerts", icon: "bell-fill", tier: "demo" },
  { label: "Investigations", path: "/investigations", icon: "folder2-open", tier: "demo" },
  { label: "Cameras & Health", path: "/cameras", icon: "cpu-fill", tier: "vision" },
  { label: "Sharing", path: "/sharing", icon: "share-fill", tier: "vision-mock" },
  { label: "Insights & Audit", path: "/audit", icon: "clipboard-data-fill", tier: "demo" },
  { label: "Users & Roles", path: "/users", icon: "people-fill", tier: "demo" },
  { label: "Organization Settings", path: "/settings", icon: "gear-fill", tier: "demo" },
];

export function Sidebar() {
  return (
    <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
      <div className="sidebar-brand">
        <a href="/" className="brand-link">
          <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: "1.7rem", marginLeft: "0.7rem" }} />
          <span className="brand-text fw-light">BigBrotherALPRDemo</span>
        </a>
      </div>

      <div className="sidebar-wrapper">
        <nav className="mt-2" aria-label="Main navigation">
          <ul className="nav sidebar-menu flex-column" data-lte-toggle="treeview" data-accordion="false">
            {NAV_ITEMS.map((item) =>
              item.tier === "vision" ? (
                <li className="nav-item" key={item.path}>
                  <span
                    className="nav-link disabled"
                    style={{ cursor: "not-allowed" }}
                    title="Modeled in the PRD as a vision-tier capability — not built in this demo"
                  >
                    <i className={`nav-icon bi bi-${item.icon}`}></i>
                    <p>
                      {item.label}
                      <span className="nav-badge badge text-bg-secondary me-3">Vision</span>
                    </p>
                  </span>
                </li>
              ) : (
                <li className="nav-item" key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  >
                    <i className={`nav-icon bi bi-${item.icon}`}></i>
                    <p>
                      {item.label}
                      {item.tier === "vision-mock" && <span className="nav-badge badge text-bg-warning me-3">Mock</span>}
                    </p>
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
