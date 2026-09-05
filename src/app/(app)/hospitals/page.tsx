'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, LocateFixed, AlertTriangle, SlidersHorizontal, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useNearbyHospitals, useCreateReferral, DEFAULT_RADIUS_KM } from '@/hooks/use-hospitals';
import { SeverityFilter } from '@/components/hospitals/SeverityFilter';
import { HospitalCard } from '@/components/hospitals/HospitalCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { Hospital, SeverityParam } from '@/types';

const VALID_SEVERITIES: SeverityParam[] = ['low', 'moderate', 'high'];

function HospitalsPageInner() {
  const searchParams = useSearchParams();
  const geo = useGeolocation();
  const createReferral = useCreateReferral();

  const paramSeverity = searchParams.get('severity');
  const sessionId = searchParams.get('sessionId') ?? undefined;
  const initialSeverity: SeverityParam =
    paramSeverity && VALID_SEVERITIES.includes(paramSeverity as SeverityParam)
      ? (paramSeverity as SeverityParam)
      : 'moderate';

  const [severity, setSeverity] = useState<SeverityParam>(initialSeverity);
  // Captured once — controls whether the "from your consultation" banner
  // shows, independent of later manual filter changes.
  const [fromConsultation, setFromConsultation] = useState(!!paramSeverity);

  // This whole page's purpose is location-based search, so — unlike the rest
  // of the app — requesting location immediately on load is the expected,
  // non-surprising behavior here (same pattern as any "nearby" screen).
  useEffect(() => {
    geo.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: hospitals, isLoading, isError, refetch } = useNearbyHospitals(geo.coords, severity);

  function handleGetDirections(hospital: Hospital) {
    createReferral.mutate({
      sessionId,
      placeId: hospital.placeId,
      name: hospital.name,
      latitude: hospital.latitude,
      longitude: hospital.longitude,
      distance: hospital.distanceKm ?? undefined,
      severity,
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">Referrals</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Hospitals near you
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-zinc-500">
            <MapPin className="h-4 w-4 text-zinc-400" />
            {geo.coords
              ? `Showing facilities within ${DEFAULT_RADIUS_KM} km of your current location`
              : 'Share your location to see nearby facilities'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => geo.request()}>
            <LocateFixed className="h-4 w-4 text-zinc-500" />
            {geo.coords ? 'Update location' : 'Share location'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast('More filters are coming soon.')}
          >
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
            Filters
          </Button>
        </div>
      </div>

      {/* Consultation context banner */}
      {fromConsultation && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold capitalize text-amber-900">Filtered by severity: {severity}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-amber-900/80">
              Based on your recent consultation — results are prioritized accordingly.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => setFromConsultation(false)}
              className="whitespace-nowrap text-xs font-medium text-amber-700 hover:text-amber-800"
            >
              Clear filter
            </button>
            <Link
              href="/consultation"
              className="hidden whitespace-nowrap text-xs font-medium text-teal-700 hover:text-teal-800 sm:inline"
            >
              Back to consultation ↗
            </Link>
          </div>
        </div>
      )}

      {/* Severity filter */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-900">
          {hospitals ? `${hospitals.length} ${hospitals.length === 1 ? 'facility' : 'facilities'} nearby` : ' '}
        </p>
        <SeverityFilter value={severity} onChange={setSeverity} />
      </div>

      {/* Results */}
      <div className="mt-3 flex flex-col gap-3">
        {geo.state === 'idle' || geo.state === 'prompting' ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 px-6 py-16 text-center">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <MapPin className="h-5 w-5" />
            </span>
            <h3 className="font-display text-base font-semibold text-zinc-900">
              {geo.state === 'prompting' ? 'Waiting for location access…' : 'Location needed'}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-zinc-600">
              MediMind needs your location to find hospitals near you. Your browser should be
              prompting you now.
            </p>
          </div>
        ) : geo.state === 'denied' || geo.state === 'unavailable' ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 px-6 py-16 text-center">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <MapPin className="h-5 w-5" />
            </span>
            <h3 className="font-display text-base font-semibold text-zinc-900">Location access needed</h3>
            <p className="mt-1 max-w-sm text-sm text-zinc-600">
              {geo.state === 'unavailable'
                ? "Your browser doesn't support location, or it's disabled."
                : "You'll need to allow location access in your browser's settings, then try again."}
            </p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => geo.request()}>
              Try again
            </Button>
          </div>
        ) : isLoading ? (
          [0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="mt-2 h-4 w-64" />
                  <Skeleton className="mt-3 h-4 w-32" />
                </div>
              </div>
            </div>
          ))
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !hospitals || hospitals.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-5 w-5" />}
            title="No facilities found nearby"
            description={`Nothing came up within ${DEFAULT_RADIUS_KM} km. Try updating your location or check back later.`}
          />
        ) : (
          hospitals.map((h, i) => (
            <HospitalCard
              key={h.placeId}
              hospital={h}
              rank={i + 1}
              isClosest={i === 0}
              onGetDirections={handleGetDirections}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense fallback={null}>
      <HospitalsPageInner />
    </Suspense>
  );
}
