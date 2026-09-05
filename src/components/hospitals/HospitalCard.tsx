'use client';

import { Star, Navigation, Phone, ShieldAlert, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Hospital, FacilityType } from '@/types';

const FACILITY_LABEL: Record<FacilityType, string> = {
  teaching_hospital: 'Teaching Hospital',
  general_hospital: 'General Hospital',
  clinic: 'Clinic',
  pharmacy: 'Pharmacy',
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <span className="flex items-center gap-1">
      <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i < full || (i === full && hasHalf)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-zinc-200 text-zinc-200',
            )}
          />
        ))}
      </span>
      <span className="text-sm text-zinc-600">
        <span className="font-medium text-zinc-900">{rating.toFixed(1)}</span>
      </span>
    </span>
  );
}

interface HospitalCardProps {
  hospital: Hospital;
  rank: number;
  isClosest: boolean;
  onGetDirections: (hospital: Hospital) => void;
}

export function HospitalCard({ hospital, rank, isClosest, onGetDirections }: HospitalCardProps) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;

  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm',
        hospital.hasEmergency && 'border-l-4 border-l-red-500',
      )}
    >
      {isClosest && (
        <span className="mb-2 inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
          Closest to you
        </span>
      )}
      <div className="flex items-start gap-4">
        <span className="num mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-zinc-900">{hospital.name}</h2>
          <p className="mt-1 truncate text-sm text-zinc-600">{hospital.address}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {hospital.rating != null && <StarRating rating={hospital.rating} />}
            {hospital.openNow != null && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium',
                  hospital.openNow ? 'text-emerald-600' : 'text-zinc-500',
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                {hospital.openNow ? 'Open now' : 'Closed now'}
              </span>
            )}
            {hospital.phone && (
              <a
                href={`tel:${hospital.phone}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800"
              >
                <Phone className="h-3.5 w-3.5" />
                {hospital.phone}
              </a>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {hospital.hasEmergency && (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                <ShieldAlert className="h-3 w-3" />
                Emergency
              </span>
            )}
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
              {FACILITY_LABEL[hospital.facilityType]}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
          <div className="text-right">
            {hospital.distanceKm != null ? (
              <>
                <p className="num text-lg font-semibold text-zinc-900">{hospital.distanceKm.toFixed(1)} km</p>
                <p className="text-xs text-zinc-500">away</p>
              </>
            ) : (
              <p className="text-xs text-zinc-400">Distance unknown</p>
            )}
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener"
            onClick={() => onGetDirections(hospital)}
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-teal-600 px-3 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <Navigation className="h-4 w-4" />
            Get directions
          </a>
        </div>
      </div>
    </div>
  );
}
