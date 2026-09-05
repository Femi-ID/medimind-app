import type {
  Gender,
  PreferredLanguage,
  Severity,
  Triage,
  VitalParameter,
} from '@/types';

/** Emergency number shown in the EMERGENCY triage banner. */
export const EMERGENCY_NUMBER = '112';

/** Client-side password minimum (matches the backend login validator). */
export const PASSWORD_MIN_LENGTH = 8;

/** Consultation cap enforced by the backend (for UI copy). */
export const MESSAGE_LIMIT_PER_HOUR = 20;

/* ------------------------------------------------------------ Enum options */
export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export const LANGUAGE_OPTIONS: { value: PreferredLanguage; label: string }[] = [
  { value: 'ENGLISH', label: 'English' },
  { value: 'PIDGIN', label: 'Pidgin' },
  { value: 'YORUBA', label: 'Yoruba' },
  { value: 'IGBO', label: 'Igbo' },
  { value: 'HAUSA', label: 'Hausa' },
];

/* --------------------------------------------------------- Vitals metadata */
/**
 * One entry per loggable vital. `param` is the snake_case value used by the
 * trends/query endpoints; `field` is the camelCase key on the Vital object and
 * the POST /vitals body. `healthy` is a soft reference range for UI hints only
 * — never presented as medical advice.
 */
export interface VitalMeta {
  param: VitalParameter;
  field: 'systolicBp' | 'diastolicBp' | 'heartRate' | 'weight' | 'bloodGlucose';
  label: string;
  short: string;
  unit: string;
  icon: string; // lucide icon name
  min: number; // input min (matches backend DTO)
  max: number; // input max (matches backend DTO)
  step: number;
  healthy?: [number, number];
  decimals: number;
}

export const VITALS: VitalMeta[] = [
  {
    param: 'systolic_bp',
    field: 'systolicBp',
    label: 'Systolic BP',
    short: 'Systolic',
    unit: 'mmHg',
    icon: 'activity',
    min: 60,
    max: 250,
    step: 1,
    healthy: [90, 120],
    decimals: 0,
  },
  {
    param: 'diastolic_bp',
    field: 'diastolicBp',
    label: 'Diastolic BP',
    short: 'Diastolic',
    unit: 'mmHg',
    icon: 'activity',
    min: 30,
    max: 150,
    step: 1,
    healthy: [60, 80],
    decimals: 0,
  },
  {
    param: 'heart_rate',
    field: 'heartRate',
    label: 'Heart rate',
    short: 'Heart rate',
    unit: 'bpm',
    icon: 'heart-pulse',
    min: 30,
    max: 220,
    step: 1,
    healthy: [60, 100],
    decimals: 0,
  },
  {
    param: 'blood_glucose',
    field: 'bloodGlucose',
    label: 'Blood glucose',
    short: 'Glucose',
    unit: 'mmol/L',
    icon: 'droplet',
    min: 2,
    max: 30,
    step: 0.1,
    healthy: [4, 7.8],
    decimals: 1,
  },
  {
    param: 'weight',
    field: 'weight',
    label: 'Weight',
    short: 'Weight',
    unit: 'kg',
    icon: 'scale',
    min: 20,
    max: 300,
    step: 0.1,
    decimals: 1,
  },
];

export const VITAL_BY_PARAM: Record<VitalParameter, VitalMeta> = VITALS.reduce(
  (acc, v) => ({ ...acc, [v.param]: v }),
  {} as Record<VitalParameter, VitalMeta>,
);

/* ------------------------------------------------- Dashboard trend chart tabs */
/** The 4 selectable views in the dashboard's trend chart. 'blood_pressure' is
 *  a combined pseudo-vital (systolic + diastolic together); the other three
 *  map 1:1 onto a single VitalParameter. */
export type ChartVital = 'blood_pressure' | 'heart_rate' | 'blood_glucose' | 'weight';

export interface ChartVitalMeta {
  key: ChartVital;
  label: string;
  shortLabel: string;
  unit: string;
  icon: string; // lucide icon name, resolved by the chart component
  /** Field(s) read off a raw Vital row for the 24H view. */
  field: 'systolicBp' | 'heartRate' | 'bloodGlucose' | 'weight';
  secondaryField?: 'diastolicBp'; // blood_pressure only
  parameter: VitalParameter; // primary parameter used for trend/raw queries
  secondaryParameter?: VitalParameter; // blood_pressure only
  decimals: number;
}

export const CHART_VITALS: ChartVitalMeta[] = [
  {
    key: 'blood_pressure',
    label: 'Blood Pressure',
    shortLabel: 'BP',
    unit: 'mmHg',
    icon: 'activity',
    field: 'systolicBp',
    secondaryField: 'diastolicBp',
    parameter: 'systolic_bp',
    secondaryParameter: 'diastolic_bp',
    decimals: 0,
  },
  {
    key: 'heart_rate',
    label: 'Heart Rate',
    shortLabel: 'Heart Rate',
    unit: 'bpm',
    icon: 'heart-pulse',
    field: 'heartRate',
    parameter: 'heart_rate',
    decimals: 0,
  },
  {
    key: 'blood_glucose',
    label: 'Glucose',
    shortLabel: 'Glucose',
    unit: 'mmol/L',
    icon: 'droplet',
    field: 'bloodGlucose',
    parameter: 'blood_glucose',
    decimals: 1,
  },
  {
    key: 'weight',
    label: 'Weight',
    shortLabel: 'Weight',
    unit: 'kg',
    icon: 'scale',
    field: 'weight',
    parameter: 'weight',
    decimals: 1,
  },
];

/** Fixed line colors per chart vital — deliberately NOT tone/status-based
 *  (unlike sparklines), so the same vital always reads as the same color. */
export const CHART_VITAL_COLOR: Record<ChartVital, string> = {
  blood_pressure: '#0D9488', // teal-600 — also used for the BP VitalCard sparkline, so both agree
  heart_rate: '#059669', // emerald-600
  blood_glucose: '#7C3AED', // violet-600
  weight: '#0EA5E9', // sky-600
};

/* ------------------------------------------------------- Triage / severity */
/** Drives the consultation UI. Tailwind class fragments kept literal so the
 *  JIT compiler can see them. */
export const TRIAGE_CONFIG: Record<
  Triage,
  { label: string; tone: string; badge: string; description: string }
> = {
  EMERGENCY: {
    label: 'Emergency',
    tone: 'border-red-300 bg-red-50 text-red-900',
    badge: 'bg-red-600 text-white',
    description: 'Seek emergency help immediately.',
  },
  URGENT: {
    label: 'Urgent',
    tone: 'border-orange-300 bg-orange-50 text-orange-900',
    badge: 'bg-orange-500 text-white',
    description: 'Seek care promptly.',
  },
  MODERATE: {
    label: 'See a clinic soon',
    tone: 'border-amber-300 bg-amber-50 text-amber-900',
    badge: 'bg-amber-500 text-white',
    description: 'Worth getting checked soon.',
  },
  SELF_CARE: {
    label: 'Self-care',
    tone: 'border-teal-200 bg-teal-50 text-teal-900',
    badge: 'bg-teal-600 text-white',
    description: 'Manageable at home for now.',
  },
};

export const SEVERITY_CONFIG: Record<Severity, { label: string; badge: string }> = {
  LOW: { label: 'Low', badge: 'bg-teal-100 text-teal-800' },
  MODERATE: { label: 'Moderate', badge: 'bg-amber-100 text-amber-800' },
  HIGH: { label: 'High', badge: 'bg-red-100 text-red-800' },
};

/** Map an envelope severity → the lowercase severity the hospitals API wants. */
export const SEVERITY_TO_PARAM: Record<Severity, 'low' | 'moderate' | 'high'> = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
};

/** Default trend window (days) for dashboard charts. */
export const DEFAULT_TREND_DAYS = 7;
/** '24h' is handled specially (raw readings, not day-aggregated trends). */
export const TREND_RANGE_OPTIONS = ['24h', 7, 30, 90] as const;
export type TrendRange = (typeof TREND_RANGE_OPTIONS)[number];
