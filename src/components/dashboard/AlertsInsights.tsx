'use client';

import { ChevronRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useVitalTrends } from '@/hooks/use-vitals';
import { computeTrendInsight } from '@/lib/vitals';

/**
 * Real insights only. The mockup also shows a scheduled-reminder item and a
 * "weekly report" item — neither maps to a backend feature (no reminders
 * system, no report generator), so they're intentionally left out rather
 * than faked.
 */
export function AlertsInsights() {
  const { data: trend } = useVitalTrends('systolic_bp', 7);
  const insight = trend ? computeTrendInsight(trend.points, 'systolic blood pressure', 'mmHg', 0, true) : null;
  const hasAlert = insight && insight.direction !== 'flat' && insight.tone === 'watch';

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Alerts &amp; Insights</p>
      <div className="mt-3 flex flex-col gap-3">
        {hasAlert ? (
          <div className="flex items-center gap-3 rounded-lg border border-l-[3px] border-zinc-200 border-l-amber-400 p-3">
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-900">
                <TrendingUp className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                BP trending upward
              </span>
              <span className="block text-xs text-zinc-500">{insight!.deltaLabel} over this period</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-l-[3px] border-zinc-200 border-l-emerald-400 p-3">
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-900">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                Nothing needs attention
              </span>
              <span className="block text-xs text-zinc-500">Your recent readings look steady</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
