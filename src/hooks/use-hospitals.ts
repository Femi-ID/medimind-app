'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { hospitalsApi } from '@/lib/api';
import type { CreateReferralPayload } from '@/lib/api/hospitals';
import type { SeverityParam } from '@/types';
import type { Coords } from '@/hooks/use-geolocation';

/** Default radius the API applies server-side when none is given (15 km). */
export const DEFAULT_RADIUS_KM = 15;

export function useNearbyHospitals(coords: Coords | null, severity: SeverityParam) {
  // Round to ~110m precision so minor GPS jitter doesn't trigger a refetch.
  const key = coords ? [coords.lat.toFixed(3), coords.lng.toFixed(3)] : null;

  return useQuery({
    queryKey: ['hospitals', 'nearby', key, severity],
    queryFn: () =>
      hospitalsApi.getNearby({
        latitude: coords!.lat,
        longitude: coords!.lng,
        severity,
      }),
    enabled: !!coords,
    staleTime: 60_000,
  });
}

export function useCreateReferral() {
  return useMutation({
    mutationFn: (payload: CreateReferralPayload) => hospitalsApi.createReferral(payload),
  });
}
