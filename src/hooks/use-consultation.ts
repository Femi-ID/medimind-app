'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationApi } from '@/lib/api';
import type { SendMessagePayload } from '@/lib/api/consultation';
import type { SendMessageResponse } from '@/types';

export const consultationKeys = {
  sessions: ['consultations', 'sessions'] as const,
  session: (id: string) => ['consultations', 'session', id] as const,
};

export function useSessions() {
  return useQuery({
    queryKey: consultationKeys.sessions,
    queryFn: () => consultationApi.listSessions(50, 0),
    staleTime: 30_000,
  });
}

export function useSession(id: string | null) {
  return useQuery({
    queryKey: id ? consultationKeys.session(id) : ['consultations', 'session', 'none'],
    queryFn: () => consultationApi.getSession(id as string),
    enabled: !!id,
    staleTime: 15_000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation<SendMessageResponse, unknown, SendMessagePayload>({
    mutationFn: (payload) => consultationApi.sendMessage(payload),
    onSuccess: (data) => {
      // Refresh the session list (title/last-message/order changes) and the
      // active session's message history.
      queryClient.invalidateQueries({ queryKey: consultationKeys.sessions });
      queryClient.invalidateQueries({ queryKey: consultationKeys.session(data.sessionId) });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => consultationApi.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.sessions });
    },
  });
}

export function useRenameSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      consultationApi.renameSession(id, title),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.sessions });
      queryClient.invalidateQueries({ queryKey: consultationKeys.session(vars.id) });
    },
  });
}
