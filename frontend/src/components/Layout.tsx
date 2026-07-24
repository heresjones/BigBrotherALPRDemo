import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout() {
  return (
    <div className="app-wrapper">
      <Topbar />
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <strong>BigBrotherALPRDemo</strong> — ALPR investigations platform.
      </footer>
    </div>
  );
}
