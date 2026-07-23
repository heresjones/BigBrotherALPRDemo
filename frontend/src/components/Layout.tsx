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
        <strong>BigBrotherALPRDemo</strong> — a demo ALPR investigations platform. No real surveillance data anywhere
        in this app; see <code>docs/PRD.md</code>.
      </footer>
    </div>
  );
}
