export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// "YYYY-MM-DD" alone parses as UTC midnight per the Date spec, which then
// renders a day early in any timezone behind UTC. Parsing the components
// directly builds a local-time Date instead, so the displayed date always
// matches what's stored.
function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(iso: string): string {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? parseDateOnly(iso) : new Date(iso);
  return date.toLocaleDateString(undefined, { dateStyle: "medium" });
}

export function formatLocation(lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return "—";
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

export function formatHeight(totalInches: number): string {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}"`;
}

export function calculateAge(dob: string, now: Date): number {
  const birth = parseDateOnly(dob);
  let age = now.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age--;
  return age;
}
