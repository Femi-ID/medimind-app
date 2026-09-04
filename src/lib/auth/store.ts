import { create } from 'zustand';
import type { User } from '@/types';

/**
 * Auth state lives in memory ONLY. The access token is never persisted; the
 * refresh token is an httpOnly cookie the frontend cannot read. On reload we
 * restore the session by calling POST /auth/refresh (see AuthProvider).
 *
 *  - 'loading'         → we haven't finished the initial refresh attempt yet
 *  - 'authenticated'   → we have an access token (and usually a user)
 *  - 'unauthenticated' → no valid session
 */
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;

  /** Updates ONLY the token. Deliberately does not touch `status` — see note below. */
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  /** Atomic: token + user + status flip together in one render. */
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: 'loading',

  // IMPORTANT: this does NOT set `status`. During bootstrap/login we need the
  // token in the store early (so the axios interceptor can attach it to the
  // profile request) without prematurely telling AuthGuard "authenticated" —
  // that used to happen a beat before `user` existed, flashing a nameless
  // "Signed in." dashboard. `status` now only changes via setAuth/clearAuth/
  // setStatus, each an atomic, fully-resolved transition.
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  setAuth: (token, user) => set({ accessToken: token, user, status: 'authenticated' }),
  clearAuth: () => set({ accessToken: null, user: null, status: 'unauthenticated' }),
  setStatus: (status) => set({ status }),
}));

/** Non-hook accessors for use inside the axios interceptor (outside React). */
export const authStore = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (t: string | null) => useAuthStore.getState().setAccessToken(t),
  clear: () => useAuthStore.getState().clearAuth(),
};
