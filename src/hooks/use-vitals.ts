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

export function useVitalTrends(parameter: VitalParameter, days: number) {
  return useQuery({
    queryKey: vitalsKeys.trends(parameter, days),
    queryFn: () => vitalsApi.getTrends(parameter, days),
    staleTime: 60_000,
  });
}

export function useRecentVitals(limit = 5) {
  return useQuery({
    queryKey: vitalsKeys.list(limit),
    queryFn: () => vitalsApi.listVitals({ limit }),
    staleTime: 30_000,
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
