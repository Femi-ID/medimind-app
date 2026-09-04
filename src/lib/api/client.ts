import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { authStore } from '@/lib/auth/store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL && typeof window !== 'undefined') {
  // Surfaces a misconfigured env early instead of failing every request opaquely.
  // eslint-disable-next-line no-console
  console.error('NEXT_PUBLIC_API_URL is not set. API requests will fail.');
}

/**
 * Main axios instance. `withCredentials: true` is REQUIRED so the browser sends
 * the httpOnly refresh cookie on /auth/* requests. The cookie is scoped to
 * /api/v1/auth backend-side, so it only rides along on auth calls anyway.
 */
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/* ------------------------------------------------- request: attach bearer */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ------------------------------------------- single-flight refresh helper */
/**
 * Only ONE refresh may be in flight at a time. The backend rotates the refresh
 * cookie on every call and treats a second use of the old cookie as token reuse
 * — which revokes ALL of the user's sessions. So every caller that hits a 401
 * shares this one promise.
 *
 * We use a bare axios call (not `api`) so the refresh request itself never goes
 * back through this interceptor.
 */
let refreshPromise: Promise<string | null> | null = null;

const RETRY_DELAYS_MS = [1500, 3000]; // backoff for transient failures only
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * A single, non-retrying refresh attempt. Render's free tier + a cold Neon DB
 * can make the FIRST request after idle take 30–50s and sometimes bounce with
 * a transient 503/429/CORS-preflight failure before the instance is fully up.
 * That is NOT the same thing as "your refresh token is invalid" — only a
 * genuine 401 from this endpoint means the session is actually gone.
 */
async function attemptRefresh(): Promise<{ token: string | null; fatal: boolean }> {
  try {
    const res = await axios.post<{ accessToken: string }>(
      `${BASE_URL}/auth/refresh`,
      null,
      { withCredentials: true, headers: { 'Content-Type': 'application/json' } },
    );
    return { token: res.data?.accessToken ?? null, fatal: false };
  } catch (err) {
    const status = (err as AxiosError).response?.status;
    // A real 401 means the backend explicitly rejected the refresh token
    // (expired, rotated, reuse-detected) — stop immediately, no retry.
    if (status === 401) return { token: null, fatal: true };
    // Anything else (network error, CORS misfire, 429, 5xx) is treated as
    // transient — the caller will retry with backoff.
    return { token: null, fatal: false };
  }
}

async function performRefresh(): Promise<string | null> {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    const { token, fatal } = await attemptRefresh();

    if (token) {
      authStore.setAccessToken(token);
      return token;
    }
    if (fatal) break; // genuine invalid session — don't waste retries

    const isLastAttempt = attempt === RETRY_DELAYS_MS.length;
    if (!isLastAttempt) await sleep(RETRY_DELAYS_MS[attempt]);
  }

  // Exhausted retries (or a fatal 401): there is no session to restore.
  authStore.clear();
  return null;
}

/** Shared entry point — coalesces concurrent refreshes into one request. */
export function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/* ------------------------------------ response: 401 → refresh → retry once */
type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

function isAuthEndpoint(url?: string) {
  if (!url) return false;
  return (
    url.includes('/auth/refresh') ||
    url.includes('/auth/login') ||
    url.includes('/auth/logout')
  );
}

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  const path = window.location.pathname;
  // Avoid bouncing when already on a public/auth page.
  if (path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/auth')) {
    return;
  }
  window.location.assign('/login');
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // Only handle a genuine 401 once, and never for the auth endpoints themselves.
    if (status !== 401 || !original || original._retry || isAuthEndpoint(original.url)) {
      return Promise.reject(error);
    }

    original._retry = true;
    const newToken = await refreshAccessToken();

    if (!newToken) {
      redirectToLogin();
      return Promise.reject(error);
    }

    // Retry the original request once with the fresh token.
    original.headers = {
      ...(original.headers ?? {}),
      Authorization: `Bearer ${newToken}`,
    };
    return api(original);
  },
);
