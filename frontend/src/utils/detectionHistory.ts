import type { Camera } from "../types";

export interface HistoricalDetection {
  id: string;
  capturedAt: string;
  cameraId: string;
}

export interface FrequencyBucket {
  label: string;
  count: number;
}

export interface PatternSummary {
  total: number;
  topCamera: Camera | undefined;
  topCameraShare: number;
  weekdayShare: number;
  weekendShare: number;
  topHourBucket: "morning" | "midday" | "evening" | "night";
  byCamera: Record<string, number>;
}

const HOUR_BUCKET_LABEL: Record<PatternSummary["topHourBucket"], string> = {
  morning: "morning (5am–11am)",
  midday: "midday (11am–4pm)",
  evening: "evening (4pm–9pm)",
  night: "overnight (9pm–5am)",
};

export function hourBucketLabel(bucket: PatternSummary["topHourBucket"]): string {
  return HOUR_BUCKET_LABEL[bucket];
}

// Deterministic PRNG seeded from the plate string, so the same plate
// always generates the same synthetic history across renders/reloads.
function seedFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function atTime(day: Date, hour: number, minute: number, cameraId: string): HistoricalDetection {
  const dt = new Date(day);
  dt.setHours(hour, minute, 0, 0);
  return { id: `hist-${cameraId}-${dt.getTime()}`, capturedAt: dt.toISOString(), cameraId };
}

// Generates a plausible year of "pattern of life" detections for a plate:
// a recurring weekday commute between two cameras, occasional weekend
// stops, and rare one-off detections elsewhere in the network.
export function generateDetectionHistory(plateText: string, cameras: Camera[], anchor: Date, days = 365): HistoricalDetection[] {
  if (cameras.length === 0) return [];
  const random = mulberry32(seedFromString(plateText));
  const shuffled = [...cameras].sort(() => random() - 0.5);
  const commuteA = shuffled[0];
  const commuteB = shuffled[1] ?? shuffled[0];
  const occasional = shuffled.slice(2, 4).length > 0 ? shuffled.slice(2, 4) : shuffled;

  const detections: HistoricalDetection[] = [];
  for (let i = days; i >= 0; i--) {
    const day = new Date(anchor);
    day.setDate(day.getDate() - i);
    const dow = day.getDay();
    const isWeekday = dow >= 1 && dow <= 5;

    if (isWeekday && random() < 0.85) {
      detections.push(atTime(day, 7 + Math.floor(random() * 2), Math.floor(random() * 60), commuteA.id));
      if (random() < 0.8) {
        detections.push(atTime(day, 16 + Math.floor(random() * 3), Math.floor(random() * 60), commuteB.id));
      }
    } else if (!isWeekday && random() < 0.3) {
      const cam = occasional[Math.floor(random() * occasional.length)];
      detections.push(atTime(day, 10 + Math.floor(random() * 8), Math.floor(random() * 60), cam.id));
    }

    if (random() < 0.05) {
      const cam = occasional[Math.floor(random() * occasional.length)];
      detections.push(atTime(day, Math.floor(random() * 24), Math.floor(random() * 60), cam.id));
    }
  }

  return detections.sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
}

export function filterByRange(detections: HistoricalDetection[], rangeDays: number, now: Date): HistoricalDetection[] {
  const start = new Date(now);
  start.setDate(start.getDate() - rangeDays);
  return detections.filter((d) => {
    const t = new Date(d.capturedAt);
    return t >= start && t <= now;
  });
}

export function bucketDetections(detections: HistoricalDetection[], rangeDays: number, now: Date): FrequencyBucket[] {
  if (rangeDays <= 1) {
    const buckets: FrequencyBucket[] = Array.from({ length: 24 }, (_, h) => ({ label: `${h}:00`, count: 0 }));
    for (const d of detections) buckets[new Date(d.capturedAt).getHours()].count++;
    return buckets;
  }

  if (rangeDays <= 30) {
    const buckets: FrequencyBucket[] = [];
    const keyed: Record<string, FrequencyBucket> = {};
    for (let i = rangeDays; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const key = day.toISOString().slice(0, 10);
      const bucket = { label: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }), count: 0 };
      keyed[key] = bucket;
      buckets.push(bucket);
    }
    for (const d of detections) {
      const key = d.capturedAt.slice(0, 10);
      const bucket = keyed[key];
      if (bucket) bucket.count += 1;
    }
    return buckets;
  }

  const weeks = Math.ceil(rangeDays / 7);
  const buckets: FrequencyBucket[] = [];
  const weekStarts: number[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);
    weekStarts.push(weekStart.getTime());
    buckets.push({ label: weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" }), count: 0 });
  }
  for (const d of detections) {
    const t = new Date(d.capturedAt).getTime();
    let idx = weekStarts.length - 1;
    for (let i = weekStarts.length - 1; i >= 0; i--) {
      if (t >= weekStarts[i]) {
        idx = i;
        break;
      }
    }
    buckets[idx].count++;
  }
  return buckets;
}

export function summarizePatterns(detections: HistoricalDetection[], cameras: Camera[]): PatternSummary | null {
  if (detections.length === 0) return null;

  const byCamera: Record<string, number> = {};
  let weekday = 0;
  let weekend = 0;
  const hourBuckets = { morning: 0, midday: 0, evening: 0, night: 0 };

  for (const d of detections) {
    byCamera[d.cameraId] = (byCamera[d.cameraId] ?? 0) + 1;
    const dt = new Date(d.capturedAt);
    const day = dt.getDay();
    if (day === 0 || day === 6) weekend++;
    else weekday++;
    const hr = dt.getHours();
    if (hr >= 5 && hr < 11) hourBuckets.morning++;
    else if (hr >= 11 && hr < 16) hourBuckets.midday++;
    else if (hr >= 16 && hr < 21) hourBuckets.evening++;
    else hourBuckets.night++;
  }

  const total = detections.length;
  const topCameraId = Object.entries(byCamera).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topHourBucket = Object.entries(hourBuckets).sort((a, b) => b[1] - a[1])[0][0] as PatternSummary["topHourBucket"];

  return {
    total,
    topCamera: cameras.find((c) => c.id === topCameraId),
    topCameraShare: topCameraId ? Math.round((byCamera[topCameraId] / total) * 100) : 0,
    weekdayShare: Math.round((weekday / total) * 100),
    weekendShare: Math.round((weekend / total) * 100),
    topHourBucket,
    byCamera,
  };
}
