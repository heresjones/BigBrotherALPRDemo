import { MockBanner } from "../components/MockBanner";
import { PageHeader, PageContent } from "../components/Page";

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
    <>
      <PageHeader title="Sharing" lead="Cross-organization camera and data sharing relationships." />
      <PageContent>
        <MockBanner>
          Illustrative only — this page shows static example data to model what a sharing-relationships screen looks
          like. No real cross-account or cross-organization data movement happens anywhere in this demo. See{" "}
          <code>docs/PRD.md §7.8</code>.
        </MockBanner>

        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Scope of access</th>
                    <th>Since</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SHARING_RELATIONSHIPS.map((r) => (
                    <tr key={r.org}>
                      <td>{r.org}</td>
                      <td className="text-body-secondary">{r.scope}</td>
                      <td className="text-body-secondary">{r.since}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}
