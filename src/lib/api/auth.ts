import { api, refreshAccessToken } from './client';

/** POST /auth/login → { accessToken } and sets the refresh cookie. */
export async function login(email: string, password: string): Promise<string> {
  const res = await api.post<{ accessToken: string }>('/auth/login', { email, password });
  return res.data.accessToken;
}

/** POST /auth/logout → 204, clears the refresh cookie. */
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

/** Shared single-flight refresh (used on load and by the interceptor). */
export const refresh = refreshAccessToken;

/** Full-page navigation target for "Continue with Google". */
export function googleLoginUrl(): string {
  return `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`;
}
