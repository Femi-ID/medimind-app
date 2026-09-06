'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vitalsApi } from '@/lib/api';
import type { CreateVitalPayload } from '@/lib/api/vitals';
import type { VitalParameter } from '@/types';

export const vitalsKeys = {
  latest: ['vitals', 'latest'] as const,
  trends: (parameter: VitalParameter, days: number) => ['vitals', 'trends', parameter, days] as const,
  list: (limit: number) => ['vitals', 'list', limit] as const,
};

export function useLatestVitals() {
  return useQuery({
    queryKey: vitalsKeys.latest,
    queryFn: vitalsApi.getLatest,
    staleTime: 60_000,
  });
}

export function useVitalTrends(parameter: VitalParameter, days: number, enabled = true) {
  return useQuery({
    queryKey: vitalsKeys.trends(parameter, days),
    queryFn: () => vitalsApi.getTrends(parameter, days),
    staleTime: 60_000,
    enabled,
  });
}

/**
 * Raw (non-aggregated) readings from the last `hours` — used for the 24H
 * chart view, where day-level averaging from /vitals/trends would collapse
 * an entire day's multiple readings into a single point. Reuses the existing
 * GET /vitals?parameter=&from=&to= endpoint; no backend change needed.
 */
export function useVitalRawWindow(parameter: VitalParameter, hours: number, enabled = true) {
  return useQuery({
    queryKey: ['vitals', 'raw-window', parameter, hours],
    queryFn: () => {
      const to = new Date();
      const from = new Date(to.getTime() - hours * 60 * 60 * 1000);
      return vitalsApi.listVitals({
        parameter,
        from: from.toISOString(),
        to: to.toISOString(),
        limit: 200,
      });
    },
    enabled,
    staleTime: 30_000,
  });
}

export function useRecentVitals(limit = 5) {
  return useQuery({
    queryKey: vitalsKeys.list(limit),
    queryFn: () => vitalsApi.listVitals({ limit }),
    staleTime: 30_000,
  });
}

/** Exact total reading count — replaces the old "fetch 200 rows and count" workaround. */
export function useVitalCount() {
  return useQuery({
    queryKey: ['vitals', 'count'],
    queryFn: vitalsApi.getCount,
    staleTime: 60_000,
  });
}

/**
 * Real, LLM-backed analysis (with a same-shape rule-based fallback server-side).
 * Shared by ObservationBanner, AlertsInsights, and the trend chart's callout —
 * react-query dedupes this to ONE network call across all three consumers.
 * staleTime matches the backend's own guidance (each call hits the LLM).
 */
export function useVitalInsights() {
  return useQuery({
    queryKey: ['vitals', 'insights'],
    queryFn: vitalsApi.getInsights,
    staleTime: 5 * 60_000,
  });
}

export function useCreateVital() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVitalPayload) => vitalsApi.createVital(payload),
    onSuccess: () => {
      // Trends/latest/list all shift after a new reading — refetch everything vitals-related.
      queryClient.invalidateQueries({ queryKey: ['vitals'] });
    },
  });
}
