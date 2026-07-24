export interface OwnerRecord {
  ownerName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  registrationExpires: string;
  personId: string;
}

// Fictional DMV/registration lookups, keyed by plate text. Entirely
// invented people and addresses — no connection to anyone real. Matches
// the "State of Riverbend" framing already used for the demo org.
// `personId` links to data/people.ts, which holds the deeper (and more
// speculative) person-level profile shown on the person page.
export const owners: Record<string, OwnerRecord> = {
  "7ABC123": {
    ownerName: "Morgan Ellis",
    streetAddress: "482 Cedar Hollow Rd",
    city: "Riverbend",
    state: "State of Riverbend",
    zip: "58210",
    registrationExpires: "2027-03-14",
    personId: "person-morgan-ellis",
  },
  "9XYZ456": {
    ownerName: "Priya Chandran",
    streetAddress: "17 Birchwood Ct",
    city: "Riverbend",
    state: "State of Riverbend",
    zip: "58204",
    registrationExpires: "2026-11-02",
    personId: "person-priya-chandran",
  },
  KLM789: {
    ownerName: "Devon Marsh",
    streetAddress: "930 Fairview Ave",
    city: "Riverbend",
    state: "State of Riverbend",
    zip: "58217",
    registrationExpires: "2027-01-19",
    personId: "person-devon-marsh",
  },
  "2DEF901": {
    ownerName: "Ana Reyes",
    streetAddress: "212 Lindenwood Dr",
    city: "Riverbend",
    state: "State of Riverbend",
    zip: "58209",
    registrationExpires: "2026-09-30",
    personId: "person-ana-reyes",
  },
  "4GHI222": {
    ownerName: "Leon Whitfield",
    streetAddress: "76 Copper Creek Ln",
    city: "Riverbend",
    state: "State of Riverbend",
    zip: "58223",
    registrationExpires: "2027-05-08",
    personId: "person-leon-whitfield",
  },
  "8JKL333": {
    ownerName: "Nadia Volkov",
    streetAddress: "3401 Aspen Grove Way",
    city: "Riverbend",
    state: "State of Riverbend",
    zip: "58201",
    registrationExpires: "2026-12-24",
    personId: "person-nadia-volkov",
  },
  "1MNO444": {
    ownerName: "Chris Okafor",
    streetAddress: "58 Millstone Pass",
    city: "Riverbend",
    state: "State of Riverbend",
    zip: "58215",
    registrationExpires: "2027-02-11",
    personId: "person-chris-okafor",
  },
  "6PQR555": {
    ownerName: "Grace Lindqvist",
    streetAddress: "614 Windermere Blvd",
    city: "Riverbend",
    state: "State of Riverbend",
    zip: "58206",
    registrationExpires: "2026-10-17",
    personId: "person-grace-lindqvist",
  },
  "3STU666": {
    ownerName: "Marcus Delaney",
    streetAddress: "88 Thistlewood Cir",
    city: "Riverbend",
    state: "State of Riverbend",
    zip: "58212",
    registrationExpires: "2027-04-03",
    personId: "person-marcus-delaney",
  },
};
