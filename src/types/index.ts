/**
 * Types mirror the MediMind backend contract exactly (verified against the
 * Prisma schema + controllers). Enum values are UPPERCASE except where the
 * backend uses lowercase (severity query params, triage query params).
 */

/* ------------------------------------------------------------------ Users */
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type PreferredLanguage = 'ENGLISH' | 'PIDGIN' | 'YORUBA' | 'IGBO' | 'HAUSA';
export type UserRole = 'USER' | 'ADMIN';
export type AuthProvider = 'LOCAL' | 'GOOGLE';

/** The only user shape the frontend ever sees (no secrets). */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number | null;
  gender: Gender | null;
  phoneNumber: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  preferredLanguage: PreferredLanguage;
  role: UserRole;
  emailVerified: boolean;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}

/* ----------------------------------------------------------------- Vitals */
export interface Vital {
  id: string;
  userId: string;
  systolicBp: number | null;
  diastolicBp: number | null;
  heartRate: number | null;
  weight: number | null;
  bloodGlucose: number | null;
  recordedAt: string;
  createdAt: string;
}

/** snake_case — required by /vitals/trends?parameter= and /vitals?parameter= */
export type VitalParameter =
  | 'systolic_bp'
  | 'diastolic_bp'
  | 'heart_rate'
  | 'weight'
  | 'blood_glucose';

/** One entry per parameter, returned as an ARRAY by GET /vitals/latest. */
export interface VitalLatestEntry {
  parameter: VitalParameter;
  value: number | null;
  recordedAt: string | null;
  vitalId: string | null;
}

/** GET /vitals/trends → { parameter, days, points }. Chart plots `avg`. */
export interface VitalTrendPoint {
  date: string; // yyyy-mm-dd
  avg: number;
  min: number;
  max: number;
  count: number;
}
export interface VitalTrends {
  parameter: VitalParameter;
  days: number;
  points: VitalTrendPoint[];
}

/* ---------------------------------------------------------- Consultations */
export type Severity = 'LOW' | 'MODERATE' | 'HIGH';
export type Triage = 'EMERGENCY' | 'URGENT' | 'MODERATE' | 'SELF_CARE';
export type ChatRole = 'USER' | 'ASSISTANT';

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  severity: Severity | null; // null on user messages
  isEmergency: boolean;
  referralSuggested: boolean;
  createdAt: string;
}

export interface ChatSessionSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: { content: string; createdAt: string; role: ChatRole } | null;
}

export interface ListSessionsResponse {
  sessions: ChatSessionSummary[];
  total: number;
}

/** GET /consultations/sessions/:id → session with full message history. */
export interface ChatSessionDetail {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

/** POST /consultations/messages response envelope (same shape for emergencies). */
export interface SendMessageResponse {
  sessionId: string;
  isNewSession: boolean;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  severity: Severity;
  referralSuggested: boolean;
  isEmergency: boolean;
  usedFallback: boolean;
  triage: Triage;
  hospitals: Hospital[];
  disclaimer: string;
}

/* -------------------------------------------------------------- Hospitals */
export type FacilityType =
  | 'teaching_hospital'
  | 'general_hospital'
  | 'clinic'
  | 'pharmacy';

/** Severity as accepted by /hospitals/nearby (lowercase). */
export type SeverityParam = 'low' | 'moderate' | 'high';

export interface Hospital {
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  facilityType: FacilityType;
  hasEmergency: boolean;
  rating: number | null; // stub/OSM data — may be null
  openNow: boolean | null; // stub/OSM data — may be null
  phone: string | null;
  distanceKm: number | null;
}

export interface Referral {
  id: string;
  userId: string;
  sessionId: string | null;
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number | null;
  severity: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ Error */
export interface ApiErrorShape {
  statusCode: number;
  code?: string; // e.g. PROFILE_INCOMPLETE
  message: string | string[];
  path: string;
  timestamp: string;
}
