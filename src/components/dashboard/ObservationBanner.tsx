'use client';

import Link from 'next/link';
import { AlertTriangle, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { useLatestVitals, useVitalTrends } from '@/hooks/use-vitals';
import { computeTrendInsight } from '@/lib/vitals';
import { formatRelative } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * Real, computed insight — not scripted copy. Built from the last 7 days of
 * systolic BP trend data; only renders a "worth attention" framing when the
 * numbers actually show a meaningful rise. No AI call involved (yet) — this
 * is a transparent, rule-based read of your own trend data.
 */
export function ObservationBanner() {
  const { data: latest } = useLatestVitals();
  const { data: trend } = useVitalTrends('systolic_bp', 7);

  const systolic = latest?.find((v) => v.parameter === 'systolic_bp');
  const diastolic = latest?.find((v) => v.parameter === 'diastolic_bp');
  const heartRate = latest?.find((v) => v.parameter === 'heart_rate');

  const insight = trend ? computeTrendInsight(trend.points, 'systolic blood pressure', 'mmHg', 0, true) : null;

  // Not enough data yet — nudge toward the first log instead of a blank gap.
  if (!insight || (systolic?.value == null)) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 lg:col-span-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-600">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            MediMind&apos;s observation
          </p>
        </div>
        <p className="mt-4 text-base text-zinc-700">
          Log a few blood pressure readings over the next week and MediMind will start surfacing
          trends here — like whether your numbers are drifting up or holding steady.
        </p>
        <p className="mt-4 text-xs text-zinc-500">Preliminary observation, not a diagnosis. Consult a qualified professional.</p>
      </div>
    );
  }

  const isConcerning = insight.tone === 'watch';

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 lg:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-600">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            MediMind&apos;s observation
          </p>
        </div>
        {isConcerning && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            Worth attention
          </span>
        )}
      </div>
      <p className="mt-1.5 text-xs text-zinc-400">Based on your last 7 days</p>
      <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-800">{insight.message}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {systolic?.value != null && diastolic?.value != null && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            BP <span className="num font-semibold text-zinc-900">{Math.round(systolic.value)}/{Math.round(diastolic.value)}</span>
            {' '}· {formatRelative(systolic.recordedAt)}
          </span>
        )}
        {heartRate?.value != null && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            HR <span className="num font-semibold text-zinc-900">{Math.round(heartRate.value)}</span> bpm
          </span>
        )}
      </div>

      {isConcerning && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href="/consultation">
              <MessageCircle className="h-4 w-4" />
              Discuss this with MediMind
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/hospitals">
              <MapPin className="h-4 w-4 text-zinc-500" />
              Find a clinic nearby
            </Link>
          </Button>
        </div>
      )}

      <p className="mt-4 text-xs text-zinc-500">Preliminary observation, not a diagnosis. Consult a qualified professional.</p>
    </div>
  );
}
