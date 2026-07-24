import type { AlprRecord, Camera } from "../types";
import { generateDetectionHistory, type HistoricalDetection } from "./detectionHistory";

export interface DestinationGuess {
  poi: string;
  cameraName: string;
  visitShare: number;
}

// Same synthetic pattern-of-life history used on the vehicle profile page
// (utils/detectionHistory.ts), combined across every plate registered to
// one person. This is the shared input for both the "likely destinations"
// and "likely workplace" guesses on the person page.
export function combinedPersonHistory(
  plateTexts: string[],
  records: AlprRecord[],
  cameras: Camera[],
  now: Date,
): HistoricalDetection[] {
  const combined: HistoricalDetection[] = [];
  for (const plate of plateTexts) {
    combined.push(...generateDetectionHistory(plate, cameras, now));
    for (const r of records) {
      if (r.plateText === plate && r.cameraId) {
        combined.push({ id: r.recordId, capturedAt: r.capturedAt, cameraId: r.cameraId });
      }
    }
  }
  return combined.sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
}

// Maps a person's most-visited cameras to the fictional points of
// interest near them — the same inference a plate + location database
// could make without ever seeing a receipt, loyalty card, or check-in.
export function inferLikelyDestinations(combined: HistoricalDetection[], cameras: Camera[]): DestinationGuess[] {
  if (combined.length === 0) return [];

  const byCamera: Record<string, number> = {};
  for (const d of combined) byCamera[d.cameraId] = (byCamera[d.cameraId] ?? 0) + 1;
  const total = combined.length;

  const guesses: DestinationGuess[] = [];
  const ranked = Object.entries(byCamera).sort((a, b) => b[1] - a[1]);
  for (const [cameraId, count] of ranked) {
    const cam = cameras.find((c) => c.id === cameraId);
    if (!cam || !cam.nearby || cam.nearby.length === 0) continue;
    guesses.push({ poi: cam.nearby[0], cameraName: cam.name, visitShare: Math.round((count / total) * 100) });
    if (guesses.length >= 4) break;
  }
  return guesses;
}
