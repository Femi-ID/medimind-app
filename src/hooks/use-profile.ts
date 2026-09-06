'use client';

import { useMutation } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import type { UpdateProfilePayload } from '@/lib/api/users';
import { useAuthStore } from '@/lib/auth/store';
import { useSessions } from '@/hooks/use-consultation';
import { useVitalCount } from '@/hooks/use-vitals';

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

/** Both counts are now exact — /vitals/count replaced the old capped-fetch
 *  workaround, and /consultations/sessions already returned a real total. */
export function useProfileStats() {
  const vitals = useVitalCount();
  const sessions = useSessions();

  return {
    isLoading: vitals.isLoading || sessions.isLoading,
    vitalsLabel: vitals.data ? String(vitals.data.count) : '—',
    consultationsLabel: sessions.data ? String(sessions.data.total) : '—',
  };
}

export function useExportData() {
  return useMutation({
    mutationFn: () => usersApi.exportData(),
  });
}

export function useExportPdf() {
  return useMutation({
    mutationFn: () => usersApi.exportPdf(),
  });
}

export function useExportCsv() {
  return useMutation({
    mutationFn: () => usersApi.exportCsv(),
  });
}
