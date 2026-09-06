'use client';

import { TrendingUp, TrendingDown, Minus, CheckCircle2 } from 'lucide-react';
import { useVitalInsights } from '@/hooks/use-vitals';
import { insightSeverityToTone } from '@/lib/vitals';
import { VITAL_BY_PARAM } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { InsightDirection } from '@/types';

const BORDER_BY_TONE: Record<string, string> = {
  good: 'border-l-emerald-400',
  watch: 'border-l-amber-400',
  alert: 'border-l-red-400',
  neutral: 'border-l-zinc-300',
};

function DirectionIcon({ direction }: { direction: InsightDirection }) {
  if (direction === 'up') return <TrendingUp className="h-3.5 w-3.5 shrink-0" />;
  if (direction === 'down') return <TrendingDown className="h-3.5 w-3.5 shrink-0" />;
  return <Minus className="h-3.5 w-3.5 shrink-0" />;
}

/**
 * Real, per-parameter insights from GET /vitals/insights — one row per vital
 * that has data, each independently colored by its own severity. Replaces
 * the old BP-only client-side heuristic.
 */
export function AlertsInsights() {
  const { data, isLoading } = useVitalInsights();
  const insights = data?.insights ?? [];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Alerts &amp; Insights</p>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      ) : insights.length === 0 ? (
        <div className="flex items-center gap-3 rounded-lg border border-l-[3px] border-zinc-200 border-l-emerald-400 p-3">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900">Nothing to show yet</p>
            <p className="text-xs text-zinc-500">Log some readings to see insights here</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {insights.map((insight) => {
            const tone = insightSeverityToTone(insight.severity);
            const label = VITAL_BY_PARAM[insight.parameter]?.short ?? insight.parameter;
            return (
              <div
                key={insight.parameter}
                className={cn('rounded-lg border border-l-[3px] p-3', BORDER_BY_TONE[tone])}
              >
                <p className="flex items-center gap-1.5 text-sm font-medium text-zinc-900">
                  <DirectionIcon direction={insight.direction} />
                  {label}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-600">{insight.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
