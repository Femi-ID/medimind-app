'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/lib/auth/store';
import { authApi, usersApi } from '@/lib/api';

/**
 * Thin convenience layer over the auth store. `signIn` runs the full local
 * login flow: POST /auth/login → store token → GET /users/profile → store user.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const token = await authApi.login(email, password);
      // Set the token first so the profile request is authenticated.
      useAuthStore.getState().setAccessToken(token);
      const profile = await usersApi.getProfile();
      setAuth(token, profile);
      return profile;
    },
    [setAuth],
  );

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* clear locally regardless */
    }
    clearAuth();
  }, [clearAuth]);

  const refreshProfile = useCallback(async () => {
    const profile = await usersApi.getProfile();
    setUser(profile);
    return profile;
  }, [setUser]);

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signIn,
    signOut,
    refreshProfile,
  };
}
