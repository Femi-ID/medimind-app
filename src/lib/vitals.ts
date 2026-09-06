import type { VitalParameter } from '@/types';
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
 * Raw hex equivalents of the tone system, for contexts that can't use
 * Tailwind classes (Recharts `stroke`/`fill` props take literal colors).
 * Single source of truth shared by VitalCard's sparkline and the dashboard's
 * trend chart, so a vital's line color always matches its badge/sparkline —
 * both driven by the same live status, not a fixed per-vital hue.
 */
export const TONE_LINE_COLOR: Record<VitalTone, string> = {
  good: '#10B981', // emerald-500
  watch: '#F59E0B', // amber-500
  alert: '#DC2626', // red-600
  neutral: '#71717A', // zinc-500
};

/** A lighter tint of the same tone, for a secondary series (e.g. diastolic)
 *  that should read as "related to" the primary line, not a rival color. */
export const TONE_LINE_COLOR_LIGHT: Record<VitalTone, string> = {
  good: '#6EE7B7', // emerald-300
  watch: '#FCD34D', // amber-300
  alert: '#FCA5A5', // red-300
  neutral: '#D4D4D8', // zinc-300
};

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

/** Maps the backend's insight severity vocabulary onto our own tone system. */
export function insightSeverityToTone(severity: 'normal' | 'watch' | 'alert'): VitalTone {
  return severity === 'normal' ? 'good' : severity;
}

export function formatVitalValue(value: number, decimals: number): string {
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}
