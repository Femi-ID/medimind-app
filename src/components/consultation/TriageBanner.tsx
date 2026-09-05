'use client';

import Link from 'next/link';
import { ShieldAlert, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SendMessageResponse } from '@/types';

/**
 * The severity call-to-action rendered after an assistant reply when the
 * backend suggests a referral (but it's NOT an emergency — emergencies get the
 * EmergencyCard instead). Tone scales with triage level.
 */
export function TriageBanner({
  result,
  onFindClinic,
}: {
  result: Pick<SendMessageResponse, 'severity' | 'triage' | 'referralSuggested'>;
  onFindClinic: () => void;
}) {
  if (!result.referralSuggested || result.triage === 'EMERGENCY' || result.triage === 'SELF_CARE') {
    return null;
  }

  const urgent = result.triage === 'URGENT';
  const tone = urgent
    ? 'border-orange-200 bg-orange-50'
    : 'border-amber-200 bg-amber-50';
  const iconTone = urgent ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600';
  const titleTone = urgent ? 'text-orange-900' : 'text-amber-900';

  return (
    <div className={cn('ml-11 flex max-w-2xl items-start gap-3 rounded-xl border p-4', tone)}>
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconTone)}>
        <ShieldAlert className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-semibold', titleTone)}>
          {urgent ? 'Seek care promptly' : 'Elevated severity detected'}
        </p>
        <p className={cn('mt-0.5 text-sm leading-relaxed', urgent ? 'text-orange-900/80' : 'text-amber-900/80')}>
          Based on your symptoms and recent readings, MediMind suggests seeing a professional{' '}
          {urgent ? 'promptly' : 'soon'}.
        </p>
      </div>
      <button
        onClick={onFindClinic}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 self-center whitespace-nowrap rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        <MapPin className="h-4 w-4" />
        Find clinic nearby
      </button>
    </div>
  );
}
