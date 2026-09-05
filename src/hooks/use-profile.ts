'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { usersApi, vitalsApi } from '@/lib/api';
import type { UpdateProfilePayload } from '@/lib/api/users';
import { useAuthStore } from '@/lib/auth/store';
import { useSessions } from '@/hooks/use-consultation';

/** Any successful profile write updates the shared auth-store user directly —
 *  every page reading `user` (sidebar, header, guards) stays in sync. */
export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => usersApi.updateProfile(payload),
    onSuccess: (user) => setUser(user),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      usersApi.changePassword(currentPassword, newPassword),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => usersApi.deleteAccount(password),
  });
}

/**
 * Real counts only — no invented "days active" or "reminders" (no backend
 * basis for either). Vitals count is a best-effort read (capped fetch, so an
 * account with more than the cap shows "200+" rather than a wrong number);
 * consultation count is exact (the sessions endpoint returns a real `total`).
 */
const VITALS_COUNT_CAP = 200;

export function useProfileStats() {
  const vitals = useQuery({
    queryKey: ['vitals', 'list', VITALS_COUNT_CAP],
    queryFn: () => vitalsApi.listVitals({ limit: VITALS_COUNT_CAP }),
    staleTime: 60_000,
  });
  const sessions = useSessions();

  const vitalsCount = vitals.data?.length ?? null;
  const isVitalsCapped = vitalsCount != null && vitalsCount >= VITALS_COUNT_CAP;

  return {
    isLoading: vitals.isLoading || sessions.isLoading,
    vitalsLabel: vitalsCount == null ? '—' : isVitalsCapped ? `${VITALS_COUNT_CAP}+` : String(vitalsCount),
    consultationsLabel: sessions.data ? String(sessions.data.total) : '—',
  };
}

export function useExportData() {
  return useMutation({
    mutationFn: () => usersApi.exportData(),
  });
}
