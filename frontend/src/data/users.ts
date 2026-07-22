import type { AppUser } from "../types";

export const initialUsers: AppUser[] = [
  { id: "user-1", name: "Alex Admin", email: "alex@example.org", role: "Admin", active: true },
  { id: "user-2", name: "Jamie Investigator", email: "jamie@example.org", role: "Investigator", active: true },
  { id: "user-3", name: "Sam Viewer", email: "sam@example.org", role: "Viewer", active: true },
  { id: "user-4", name: "Taylor Investigator", email: "taylor@example.org", role: "Investigator", active: false },
];
