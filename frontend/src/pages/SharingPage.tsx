import { MockBanner } from "../components/MockBanner";

// Static illustrative data per docs/PRD.md §7.8 — Sharing is explicitly
// "[VISION, UI-only mock]": it demonstrates the information architecture of
// cross-org sharing without this demo building real multi-tenancy.
const MOCK_SHARING_RELATIONSHIPS = [
  { org: "Lakeview County Sheriff", scope: "Search detections, receive hotlist alerts", since: "2026-03-01" },
  { org: "Midtown Regional Task Force", scope: "Search detections only", since: "2026-05-14" },
  { org: "Riverbend PD (this org)", scope: "Owns all cameras and records shown elsewhere in this demo", since: "—" },
];

export default function SharingPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Sharing</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Cross-organization camera and data sharing relationships.</p>
      <MockBanner>
        Illustrative only — this page shows static example data to model what a sharing-relationships screen looks
        like. No real cross-account or cross-organization data movement happens anywhere in this demo. See{" "}
        <code>docs/PRD.md §7.8</code>.
      </MockBanner>

      <div className="overflow-x-auto rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-1)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-hairline)] text-[var(--text-muted)]">
              <th className="px-3 py-2 font-medium">Organization</th>
              <th className="px-3 py-2 font-medium">Scope of access</th>
              <th className="px-3 py-2 font-medium">Since</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SHARING_RELATIONSHIPS.map((r) => (
              <tr key={r.org} className="border-b border-[var(--border-hairline)] last:border-0">
                <td className="px-3 py-2 text-[var(--text-primary)]">{r.org}</td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">{r.scope}</td>
                <td className="px-3 py-2 text-[var(--text-muted)]">{r.since}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
