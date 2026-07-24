import type { AlprRecord, Camera } from "../types";

export interface DeviationCandidate {
  recordId: string;
  capturedAt: string;
  cameraId: string;
  score: number;
  reasons: string[];
}

export type Severity = "low" | "medium" | "high";

export function severityOf(score: number): Severity {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}

// Sensitivity is a 0-100 slider; higher sensitivity flags weaker signals.
export function scoreThreshold(sensitivity: number): number {
  return Math.round(100 - sensitivity);
}

function circularHourDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 24;
  return Math.min(d, 24 - d);
}

// Flags detections that break a vehicle's own established pattern: a
// camera it's essentially never at, and/or an hour of day far outside
// every other detection. Needs at least 3 located detections to have
// enough of a baseline to judge — most plates in this dataset have 1-2
// and will never produce a candidate, by design.
export function detectDeviations(plateRecords: AlprRecord[], cameras: Camera[]): DeviationCandidate[] {
  const located = plateRecords.filter((r): r is AlprRecord & { cameraId: string } => r.cameraId !== null);
  if (located.length < 3) return [];

  const cameraCounts: Record<string, number> = {};
  for (const r of located) cameraCounts[r.cameraId] = (cameraCounts[r.cameraId] ?? 0) + 1;
  const total = located.length;

  const candidates: DeviationCandidate[] = [];

  for (const r of located) {
    const others = located.filter((x) => x.recordId !== r.recordId);
    const hour = new Date(r.capturedAt).getHours();
    const minHourGap = Math.min(...others.map((o) => circularHourDistance(hour, new Date(o.capturedAt).getHours())));
    const cameraShare = cameraCounts[r.cameraId] / total;
    const isRareCamera = cameraCounts[r.cameraId] === 1 && total >= 3;
    const isOddHour = minHourGap >= 5;

    if (!isRareCamera && !isOddHour) continue;

    const cameraRarityScore = isRareCamera ? 55 : Math.round((1 - cameraShare) * 20);
    const hourOddityScore = Math.round((Math.min(minHourGap, 12) / 12) * 45);
    const score = Math.min(100, cameraRarityScore + hourOddityScore);

    const reasons: string[] = [];
    const cam = cameras.find((c) => c.id === r.cameraId);
    if (isRareCamera) {
      reasons.push(`Only detection at ${cam?.name ?? "this camera"} — every other sighting is elsewhere.`);
    }
    if (isOddHour) {
      reasons.push("Detected at an hour far outside this vehicle's usual activity window.");
    }

    candidates.push({ recordId: r.recordId, capturedAt: r.capturedAt, cameraId: r.cameraId, score, reasons });
  }

  return candidates.sort((a, b) => b.score - a.score);
}
