import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { PageHeader, PageContent } from "../components/Page";
import { ClaimBadge, ClaimLegend } from "../components/ClaimBadge";
import { people } from "../data/people";
import { personProfiles } from "../data/personProfiles";
import { owners } from "../data/owners";
import { summarizePatterns, hourBucketLabel } from "../utils/detectionHistory";
import { combinedPersonHistory, inferLikelyDestinations } from "../utils/personInsights";
import { formatDate, formatHeight, calculateAge } from "../utils/format";

export default function PersonPage() {
  const { personId } = useParams<{ personId: string }>();
  const { records, cameras } = useAppData();
  const now = useMemo(() => new Date(), []);

  const person = personId ? people[personId] : undefined;
  const profile = personId ? personProfiles[personId] : undefined;

  const registeredPlates = useMemo(
    () => (person ? Object.entries(owners).filter(([, o]) => o.personId === person.id).map(([plate]) => plate) : []),
    [person],
  );

  const combined = useMemo(
    () => combinedPersonHistory(registeredPlates, records, cameras, now),
    [registeredPlates, records, cameras, now],
  );
  const destinations = useMemo(() => inferLikelyDestinations(combined, cameras), [combined, cameras]);
  const patterns = useMemo(() => summarizePatterns(combined, cameras), [combined, cameras]);

  if (!person || !profile) {
    return (
      <>
        <PageHeader title="Person not found" />
        <PageContent>
          <Link to="/search" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Vehicle Search
          </Link>
        </PageContent>
      </>
    );
  }

  const household = person.householdIds.map((id) => people[id]).filter((h): h is NonNullable<typeof h> => Boolean(h));

  return (
    <>
      <PageHeader title={person.name} lead={`${person.streetAddress}, ${person.city}, ${person.state} ${person.zip}`} />
      <PageContent>
        <Link to="/search" className="btn btn-outline-secondary btn-sm mb-3">
          <i className="bi bi-arrow-left me-1"></i>
          Back to Vehicle Search
        </Link>

        <div className="alert alert-danger">
          <i className="bi bi-exclamation-octagon-fill me-2"></i>
          <strong>
            Everything below the address is inferred, guessed from public records, or explicitly not connected in
            this demo.
          </strong>{" "}
          None of it is verified, and nothing on this page is a direct camera observation of this person — a
          license plate camera only ever sees a vehicle. This page exists to show how far a plate search can reach
          once it starts linking to other data sources, not to demonstrate that it should.
        </div>
        <ClaimLegend />

        <div className="card mb-4">
          <div className="card-body d-flex flex-wrap align-items-center gap-4">
            <img
              src={person.photoUrl}
              alt={`License photo of ${person.name}`}
              style={{ width: 120, height: 120, objectFit: "cover" }}
              className="rounded border"
            />
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <ClaimBadge level="external" />
                <span className="text-body-secondary small">
                  {registeredPlates.length > 0
                    ? "License photo on file with vehicle registration"
                    : "License photo — driver's license lookup for this address, not tied to any vehicle"}
                </span>
              </div>
              <div className="fw-semibold fs-5">{person.name}</div>
              <div className="text-body-secondary mb-3">
                {person.streetAddress}, {person.city}, {person.state} {person.zip}
              </div>
              <div className="row g-3 small" style={{ maxWidth: 560 }}>
                <div className="col-6 col-md-4">
                  <div className="text-body-secondary">Gender</div>
                  <div>{person.gender}</div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="text-body-secondary">Date of birth</div>
                  <div>
                    {formatDate(person.dateOfBirth)} ({calculateAge(person.dateOfBirth, now)})
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="text-body-secondary">Birthplace</div>
                  <div>{person.birthplace}</div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="text-body-secondary">Height / weight</div>
                  <div>
                    {formatHeight(person.heightInches)}, {person.weightLbs} lb
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="text-body-secondary">Eyes / hair</div>
                  <div>
                    {person.eyeColor}, {person.hairColor}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">Registered vehicles</h3>
              </div>
              <div className="card-body">
                {registeredPlates.length === 0 ? (
                  <p className="text-body-secondary mb-0">No vehicles registered to this person on file.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {registeredPlates.map((plate) => {
                      const record = records.find((r) => r.plateText === plate);
                      return (
                        <li key={plate} className="mb-2">
                          {record ? (
                            <Link to={`/map/${record.recordId}`} className="font-monospace-lg text-decoration-none">
                              {plate}
                            </Link>
                          ) : (
                            <span className="font-monospace-lg">{plate}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">Household</h3>
              </div>
              <div className="card-body">
                {household.length === 0 ? (
                  <p className="text-body-secondary mb-0">No other residents linked to this address.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {household.map((h) => (
                      <li key={h.id} className="d-flex align-items-center gap-2 mb-2">
                        <img
                          src={h.photoUrl}
                          alt={`License photo of ${h.name}`}
                          style={{ width: 40, height: 40, objectFit: "cover" }}
                          className="rounded-circle border"
                        />
                        <div>
                          <Link to={`/person/${h.id}`}>{h.name}</Link>
                          <span className="text-body-secondary small ms-2">— same address on file</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <h3 className="fs-5 mb-3">Inferred information</h3>
        <div className="accordion mb-4" id="personAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseVoter"
              >
                <i className="bi bi-check2-square me-2"></i>
                Voter registration
              </button>
            </h2>
            <div id="collapseVoter" className="accordion-collapse collapse show" data-bs-parent="#personAccordion">
              <div className="accordion-body">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <ClaimBadge level="external" />
                  <span className="text-body-secondary small">Public voter file lookup</span>
                </div>
                {profile.voter.registered ? (
                  <p className="mb-0">
                    Registered to vote. Party affiliation on file: <strong>{profile.voter.party}</strong>.
                  </p>
                ) : (
                  <p className="mb-0">No registration found under this name at this address.</p>
                )}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseContact"
              >
                <i className="bi bi-at me-2"></i>
                Possible contact &amp; social profiles
              </button>
            </h2>
            <div id="collapseContact" className="accordion-collapse collapse" data-bs-parent="#personAccordion">
              <div className="accordion-body">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <ClaimBadge level="inferred" />
                  <span className="text-body-secondary small">Pattern-matched from name — not confirmed</span>
                </div>
                <p className="text-body-secondary small mb-2">Possible emails</p>
                <ul className="mb-3">
                  {profile.possibleEmails.map((email) => (
                    <li key={email} className="font-monospace">
                      {email}
                    </li>
                  ))}
                </ul>
                <p className="text-body-secondary small mb-2">Possible social profiles</p>
                {profile.possibleSocialHandles.length === 0 ? (
                  <p className="text-body-secondary mb-0">No likely profile matches found.</p>
                ) : (
                  <ul className="mb-0">
                    {profile.possibleSocialHandles.map((s) => (
                      <li key={`${s.platform}-${s.handle}`}>
                        {s.platform}: <span className="font-monospace">{s.handle}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseProperty"
              >
                <i className="bi bi-house-door-fill me-2"></i>
                Property &amp; residency
              </button>
            </h2>
            <div id="collapseProperty" className="accordion-collapse collapse" data-bs-parent="#personAccordion">
              <div className="accordion-body">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <ClaimBadge level="estimated" />
                  <span className="text-body-secondary small">County property record match</span>
                </div>
                <p className="mb-0">
                  {profile.homeownership === "owner" && "Likely owns this address, based on a property record match."}
                  {profile.homeownership === "renter" && "No property record match — likely rents this address."}
                  {profile.homeownership === "unknown" && "Not enough information to estimate ownership status."}
                </p>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseEducation"
              >
                <i className="bi bi-mortarboard-fill me-2"></i>
                Education &amp; employment
              </button>
            </h2>
            <div id="collapseEducation" className="accordion-collapse collapse" data-bs-parent="#personAccordion">
              <div className="accordion-body">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <ClaimBadge level="inferred" />
                  <span className="text-body-secondary small">Guessed from public profile patterns and camera activity</span>
                </div>
                <p className="mb-2">{profile.education ?? "No public education records matched."}</p>
                {patterns && patterns.weekdayShare >= 60 && patterns.topCamera ? (
                  <p className="mb-0">
                    Likely regular weekday location: near <strong>{patterns.topCamera.name}</strong> (
                    {hourBucketLabel(patterns.topHourBucket)} arrival pattern) — consistent with a workplace or
                    regular commute stop, not confirmed.
                  </p>
                ) : (
                  <p className="text-body-secondary mb-0">Not enough weekday pattern data to guess a workplace.</p>
                )}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseDestinations"
              >
                <i className="bi bi-geo-alt-fill me-2"></i>
                Likely regular destinations
              </button>
            </h2>
            <div id="collapseDestinations" className="accordion-collapse collapse" data-bs-parent="#personAccordion">
              <div className="accordion-body">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <ClaimBadge level="inferred" />
                  <span className="text-body-secondary small">
                    Based only on which fixed cameras this person's vehicle passes most often — not on any
                    purchase, loyalty card, or check-in data
                  </span>
                </div>
                {destinations.length === 0 ? (
                  <p className="text-body-secondary mb-0">
                    No vehicle on file for this person — nothing to infer.
                  </p>
                ) : (
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>Likely place</th>
                        <th>Near</th>
                        <th>Share of detections</th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinations.map((d) => (
                        <tr key={d.cameraName}>
                          <td>{d.poi}</td>
                          <td className="text-body-secondary">{d.cameraName}</td>
                          <td>{d.visitShare}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFinancial"
              >
                <i className="bi bi-lock-fill me-2"></i>
                Financial &amp; criminal records
              </button>
            </h2>
            <div id="collapseFinancial" className="accordion-collapse collapse" data-bs-parent="#personAccordion">
              <div className="accordion-body">
                <p className="text-body-secondary mb-0">
                  <i className="bi bi-slash-circle me-2"></i>
                  This platform can be integrated with credit-reporting and criminal-record providers. That
                  integration is <strong>not connected in this demo</strong> — see <code>docs/PRD.md</code>. This
                  row exists to show the interface has a place for it, not that any data has been pulled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}
