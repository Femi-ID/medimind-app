import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ApiErrorShape, User } from '@/types';

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "Ada Obi" from a user (or "there" as a friendly fallback). */
export function fullName(user?: Pick<User, 'firstName' | 'lastName'> | null) {
  if (!user) return '';
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
}

export function initials(user?: Pick<User, 'firstName' | 'lastName'> | null) {
  if (!user) return '?';
  const a = user.firstName?.[0] ?? '';
  const b = user.lastName?.[0] ?? '';
  return (a + b).toUpperCase() || '?';
}

/* --------------------------------------------------------------- Dates */
export function formatDate(iso: string | null | undefined, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, opts ?? { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** "just now", "5m ago", "3h ago", "2d ago", else a date. */
export function formatRelative(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return '';
  const diff = Date.now() - d;
  const s = Math.round(diff / 1000);
  if (s < 45) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

/* --------------------------------------------------------- Error helper */
/**
 * Turn any thrown value (axios error, backend envelope, plain Error) into a
 * single human-readable string safe to show in a toast.
 */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!err) return fallback;

  // axios-style error with a response body
  const anyErr = err as {
    response?: { data?: Partial<ApiErrorShape> };
    message?: string;
  };
  const data = anyErr.response?.data;
  if (data?.message) {
    return Array.isArray(data.message) ? data.message.join(' ') : String(data.message);
  }
  // No `response` at all means the request never completed round-trip — most
  // often a free-tier backend waking from idle (can take 30-50s), sometimes a
  // genuine connectivity/CORS issue. Either way "Network Error" alone isn't
  // actionable, so say what's likely happening.
  if (!anyErr.response && typeof anyErr.message === 'string' && anyErr.message) {
    return 'Could not reach the server. It may be waking up from idle — this can take up to a minute on first load. Please try again in a moment.';
  }
  if (typeof anyErr.message === 'string' && anyErr.message) return anyErr.message;
  return fallback;
}

/** Pull the tagged `code` (e.g. PROFILE_INCOMPLETE) off an error, if present. */
export function getErrorCode(err: unknown): string | undefined {
  const anyErr = err as { response?: { data?: Partial<ApiErrorShape> } };
  return anyErr.response?.data?.code;
}

/** HTTP status off an axios error, if present. */
export function getErrorStatus(err: unknown): number | undefined {
  const anyErr = err as { response?: { status?: number } };
  return anyErr.response?.status;
}
