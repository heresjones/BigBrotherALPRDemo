import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

export function Topbar() {
  const { users, currentUser, setCurrentUserId, orgSettings, alerts, hotlists } = useAppData();
  const newAlerts = alerts.filter((a) => a.status === "new");

  return (
    <nav className="app-header navbar navbar-expand bg-body">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button" aria-label="Toggle sidebar">
              <i className="bi bi-list"></i>
            </a>
          </li>
          <li className="nav-item d-none d-md-flex align-items-center">
            <span className="navbar-text">{orgSettings.name}</span>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto">
          {/* Notifications = active alerts, tied to real state (not demo filler) */}
          <li className="nav-item dropdown">
            <a
              className="nav-link"
              data-bs-toggle="dropdown"
              href="#"
              aria-label={`Alerts: ${newAlerts.length} new`}
            >
              <i className="bi bi-bell-fill"></i>
              {newAlerts.length > 0 && <span className="navbar-badge badge text-bg-warning">{newAlerts.length}</span>}
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <span className="dropdown-item dropdown-header">
                {newAlerts.length} new alert{newAlerts.length === 1 ? "" : "s"}
              </span>
              <div className="dropdown-divider"></div>
              {newAlerts.length === 0 && <span className="dropdown-item text-body-secondary">Nothing new to review.</span>}
              {newAlerts.slice(0, 5).map((alert) => {
                const hotlist = hotlists.find((h) => h.id === alert.hotlistId);
                return (
                  <div key={alert.id}>
                    <Link to="/alerts" className="dropdown-item">
                      <i className="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
                      Plate {alert.matchedPlateText} — {hotlist?.name ?? "hotlist match"}
                    </Link>
                    <div className="dropdown-divider"></div>
                  </div>
                );
              })}
              <Link to="/alerts" className="dropdown-item dropdown-footer">
                See all alerts
              </Link>
            </div>
          </li>

          {/* Fullscreen + color mode toggles ship free with adminlte.js */}
          <li className="nav-item">
            <a className="nav-link" href="#" data-lte-toggle="fullscreen" aria-label="Toggle fullscreen">
              <i data-lte-icon="maximize" className="bi bi-arrows-fullscreen"></i>
              <i data-lte-icon="minimize" className="bi bi-fullscreen-exit d-none"></i>
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link"
              href="#"
              id="bd-theme"
              aria-label="Toggle color scheme"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-sun-fill" data-lte-theme-icon="light"></i>
              <i className="bi bi-moon-fill d-none" data-lte-theme-icon="dark"></i>
              <i className="bi bi-circle-half d-none" data-lte-theme-icon="auto"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme" style={{ "--bs-dropdown-min-width": "8rem" } as React.CSSProperties}>
              <li>
                <button type="button" className="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
                  <i className="bi bi-sun-fill me-2"></i>
                  Light
                  <i className="bi bi-check-lg ms-auto d-none"></i>
                </button>
              </li>
              <li>
                <button type="button" className="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false">
                  <i className="bi bi-moon-fill me-2"></i>
                  Dark
                  <i className="bi bi-check-lg ms-auto d-none"></i>
                </button>
              </li>
              <li>
                <button type="button" className="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto" aria-pressed="true">
                  <i className="bi bi-circle-half me-2"></i>
                  Auto
                  <i className="bi bi-check-lg ms-auto d-none"></i>
                </button>
              </li>
            </ul>
          </li>

          {/* "Acting as" — previews role-gating (docs/PRD.md §5 Principle 4) without real auth */}
          <li className="nav-item dropdown user-menu">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              <i className="bi bi-person-circle fs-4"></i>
              <span className="d-none d-md-inline ms-1">{currentUser.name}</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <li className="user-header text-bg-primary">
                <i className="bi bi-person-circle" style={{ fontSize: "3rem" }}></i>
                <p>
                  {currentUser.name}
                  <small>Acting as {currentUser.role}</small>
                </p>
              </li>
              <li className="dropdown-header">Switch user</li>
              {users
                .filter((u) => u.active)
                .map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      className="dropdown-item d-flex align-items-center justify-content-between"
                      onClick={() => setCurrentUserId(u.id)}
                    >
                      <span>
                        {u.name} <span className="text-body-secondary">({u.role})</span>
                      </span>
                      {u.id === currentUser.id && <i className="bi bi-check-lg"></i>}
                    </button>
                  </li>
                ))}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
