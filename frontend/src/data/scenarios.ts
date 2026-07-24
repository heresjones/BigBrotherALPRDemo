export interface ScenarioMeta {
  slug: string;
  title: string;
  concern: string;
  reveal: string;
}

// Mirrors docs/DEMO_SCENARIOS.md §3 — keep titles/concerns/reveal lines in
// sync with that doc if either changes.
export const SCENARIOS: ScenarioMeta[] = [
  {
    slug: "travel-history",
    title: "Reconstructing someone's movements",
    concern: "Separate public observations become a searchable travel history.",
    reveal: "The camera never followed this person. The database did.",
  },
  {
    slug: "false-match",
    title: "A false plate match causing a high-risk alert",
    concern: "One mistaken character can turn an innocent vehicle into a suspect vehicle.",
    reveal: "This alert was not evidence. It was a computer's guess that still needed verification.",
  },
  {
    slug: "network-expansion",
    title: "Cross-agency network expansion",
    concern: "A town may approve ten cameras while its users can search thousands of cameras elsewhere.",
    reveal: "The number on the street is not necessarily the size of the surveillance network.",
  },
  {
    slug: "watchlist-abuse",
    title: "Custom watchlist abuse",
    concern: "An authorized user may have a technically valid login but an improper purpose.",
    reveal: "Encryption stops an outsider. It does not stop an authorized user from making an improper search.",
  },
  {
    slug: "sensitive-location",
    title: "Sensitive-location searches",
    concern: "A system can reveal sensitive associations without facial recognition.",
    reveal: "You don't need facial recognition to learn something sensitive about a person.",
  },
  {
    slug: "appearance-search",
    title: "Searching by appearance instead of plate",
    concern: "A vague description can turn many innocent vehicles into investigative candidates.",
    reveal: "The search produces leads — not proof. Everyone who resembles the description enters the candidate pool.",
  },
  {
    slug: "owner-vs-driver",
    title: "Registered owner is not necessarily the driver",
    concern: "A correct plate observation can still produce an incorrect human conclusion.",
    reveal: "The camera can identify a vehicle. It cannot establish who was driving.",
  },
  {
    slug: "deletion-loophole",
    title: "The 30-day deletion loophole",
    concern: "Automatic deletion from the live system does not delete exported copies.",
    reveal: "Retention controls the original database. It cannot automatically recall every copy that left it.",
  },
  {
    slug: "audit-blind-spot",
    title: "Audit logs that nobody reviews",
    concern: "Logging misconduct is different from preventing or detecting it promptly.",
    reveal: "The system recorded every questionable search perfectly. Nobody looked.",
  },
  {
    slug: "capability-creep",
    title: "Capability creep",
    concern: "A system approved for limited still-image ALPR can acquire broader capabilities later.",
    reveal: "The public debate happened when the system did one thing. The software changed afterward.",
  },
  {
    slug: "dark-data-search",
    title: "Searching by identity instead of a plate",
    concern:
      "A platform built to search license plates can also search by SSN, email, IP address, crypto wallet, or messaging handle — collapsing the line between a vehicle search and a search of a person's whole digital life.",
    reveal:
      "A search that starts with \"see everything\" doesn't need a plate. It needs an identifier — and a reason field the system already filled in for you.",
  },
];

export function scenarioBySlug(slug: string | undefined): ScenarioMeta | undefined {
  return SCENARIOS.find((s) => s.slug === slug);
}
