import type { VitalParameter, VitalTrendPoint } from '@/types';
import { VITAL_BY_PARAM } from '@/lib/constants';

export type VitalTone = 'good' | 'watch' | 'alert' | 'neutral';

export interface VitalStatus {
  label: string;
  tone: VitalTone;
}

const TONE_BADGE: Record<VitalTone, string> = {
  good: 'bg-emerald-50 text-emerald-700',
  watch: 'bg-amber-50 text-amber-700',
  alert: 'bg-red-50 text-red-700',
  neutral: 'bg-zinc-100 text-zinc-600',
};
export function toneBadgeClass(tone: VitalTone) {
  return TONE_BADGE[tone];
}

const TONE_DOT: Record<VitalTone, string> = {
  good: 'bg-emerald-500',
  watch: 'bg-amber-500',
  alert: 'bg-red-500',
  neutral: 'bg-zinc-400',
};
export function toneDotClass(tone: VitalTone) {
  return TONE_DOT[tone];
}

/**
 * Informational-only classification against commonly cited public-health
 * reference ranges — never a diagnosis. Used purely to color a badge and
 * decide whether to surface an insight card.
 */
export function classifyBloodPressure(systolic: number, diastolic: number): VitalStatus {
  if (systolic >= 180 || diastolic >= 120) return { label: 'Crisis range', tone: 'alert' };
  if (systolic >= 140 || diastolic >= 90) return { label: 'High', tone: 'alert' };
  if (systolic >= 130 || diastolic >= 80) return { label: 'Elevated', tone: 'watch' };
  if (systolic < 90 || diastolic < 60) return { label: 'Low', tone: 'watch' };
  return { label: 'Normal', tone: 'good' };
}

export function classifyVital(parameter: VitalParameter, value: number): VitalStatus {
  const meta = VITAL_BY_PARAM[parameter];
  if (!meta.healthy) return { label: 'Logged', tone: 'neutral' };
  const [lo, hi] = meta.healthy;
  if (value < lo) return { label: 'Low', tone: 'watch' };
  if (value > hi) return { label: 'High', tone: 'watch' };
  return { label: 'Normal', tone: 'good' };
}

/* ------------------------------------------------------------- Insights */

export interface TrendInsight {
  direction: 'up' | 'down' | 'flat';
  deltaLabel: string; // e.g. "+12 mmHg"
  message: string;
  tone: VitalTone;
}

/**
 * Compares the earliest vs latest point in a trend window. Returns null when
 * there isn't enough data to say anything meaningful (avoids inventing a
 * "trend" out of one or two noisy readings).
 */
export function computeTrendInsight(
  points: VitalTrendPoint[],
  label: string,
  unit: string,
  decimals: number,
  riseIsConcerning = true,
): TrendInsight | null {
  const withData = points.filter((p) => p.count > 0);
  if (withData.length < 3) return null;

  const first = withData[0].avg;
  const last = withData[withData.length - 1].avg;
  const delta = last - first;
  const round = (n: number) => Number(n.toFixed(decimals));
  const absDelta = round(Math.abs(delta));

  // Not a meaningful move — under ~4% of the first value (with a small floor).
  const threshold = Math.max(Math.abs(first) * 0.04, decimals > 0 ? 0.3 : 2);
  if (absDelta < threshold) {
    return {
      direction: 'flat',
      deltaLabel: `Steady`,
      message: `Your ${label.toLowerCase()} has stayed steady over this period.`,
      tone: 'good',
    };
  }

  const direction = delta > 0 ? 'up' : 'down';
  const sign = delta > 0 ? '+' : '−';
  const concerning = riseIsConcerning ? direction === 'up' : direction === 'down';

  return {
    direction,
    deltaLabel: `${sign}${absDelta} ${unit}`,
    message: `Your ${label.toLowerCase()} has trended ${direction === 'up' ? 'upward' : 'downward'} by ${absDelta} ${unit} over this period. Today's average is ${round(last)} ${unit}.`,
    tone: concerning ? 'watch' : 'good',
  };
}

export function formatVitalValue(value: number, decimals: number): string {
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}
