export interface VoterRecord {
  registered: boolean;
  party?: string;
}

export interface SocialHandle {
  platform: string;
  handle: string;
}

export interface InferredProfile {
  voter: VoterRecord;
  // Pattern-matched guesses only — never a real, deliverable address.
  // All on the .example reserved domain (RFC 2606), same convention used
  // in the Dark Data Search scenario.
  possibleEmails: string[];
  possibleSocialHandles: SocialHandle[];
  homeownership: "owner" | "renter" | "unknown";
  education?: string;
}

// Party affiliation is deliberately mixed and roughly balanced across
// these fictional people — this isn't meant to read as commentary on any
// real distribution, only to show that the field exists and is populated
// from what is, in reality, public record in most US states.
export const personProfiles: Record<string, InferredProfile> = {
  "person-morgan-ellis": {
    voter: { registered: true, party: "Independent" },
    possibleEmails: ["m.ellis@mail.example", "morgan.ellis82@mail.example"],
    possibleSocialHandles: [{ platform: "Instagram", handle: "@morgan.ellis" }],
    homeownership: "owner",
    education: "Riverbend Community College — unconfirmed match",
  },
  "person-jules-ellis": {
    voter: { registered: true, party: "Democratic" },
    possibleEmails: ["j.ellis@mail.example"],
    possibleSocialHandles: [],
    homeownership: "owner",
  },
  "person-priya-chandran": {
    voter: { registered: false },
    possibleEmails: ["priya.chandran@mail.example"],
    possibleSocialHandles: [{ platform: "LinkedIn", handle: "/in/priyachandran" }],
    homeownership: "renter",
  },
  "person-devon-marsh": {
    voter: { registered: true, party: "Republican" },
    possibleEmails: ["d.marsh@mail.example"],
    possibleSocialHandles: [],
    homeownership: "unknown",
  },
  "person-ana-reyes": {
    voter: { registered: true, party: "Democratic" },
    possibleEmails: ["ana.reyes@mail.example", "anareyes7@mail.example"],
    possibleSocialHandles: [{ platform: "Instagram", handle: "@ana.reyes" }],
    homeownership: "owner",
    education: "State University — unconfirmed match",
  },
  "person-leon-whitfield": {
    voter: { registered: false },
    possibleEmails: ["l.whitfield@mail.example"],
    possibleSocialHandles: [],
    homeownership: "renter",
  },
  "person-nadia-volkov": {
    voter: { registered: true, party: "Nonpartisan" },
    possibleEmails: ["nadia.volkov@mail.example"],
    possibleSocialHandles: [{ platform: "Facebook", handle: "/nadia.volkov" }],
    homeownership: "owner",
  },
  "person-chris-okafor": {
    voter: { registered: true, party: "Independent" },
    possibleEmails: ["c.okafor@mail.example"],
    possibleSocialHandles: [],
    homeownership: "unknown",
  },
  "person-grace-lindqvist": {
    voter: { registered: true, party: "Republican" },
    possibleEmails: ["grace.lindqvist@mail.example"],
    possibleSocialHandles: [{ platform: "LinkedIn", handle: "/in/gracelindqvist" }],
    homeownership: "owner",
    education: "Riverbend Technical Institute — unconfirmed match",
  },
  "person-marcus-delaney": {
    voter: { registered: true, party: "Democratic" },
    possibleEmails: ["marcus.delaney@mail.example", "m.delaney1990@mail.example"],
    possibleSocialHandles: [{ platform: "Instagram", handle: "@marcus.delaney" }],
    homeownership: "renter",
  },
  "person-robin-delaney": {
    voter: { registered: false },
    possibleEmails: ["robin.delaney@mail.example"],
    possibleSocialHandles: [],
    homeownership: "renter",
  },
};
