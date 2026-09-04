'use client';

import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useVitalTrends } from '@/hooks/use-vitals';
import { computeTrendInsight } from '@/lib/vitals';
import { TREND_RANGE_OPTIONS } from '@/lib/constants';
import { cn, formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/shared/EmptyState';

interface TooltipPayloadItem {
  color: string;
  name: string;
  value: number;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-zinc-900">{label ? formatDate(label) : ''}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-1.5 text-zinc-600">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}
          <span className="num ml-auto font-semibold text-zinc-900">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function VitalTrendChart() {
  const [days, setDays] = useState<(typeof TREND_RANGE_OPTIONS)[number]>(7);

  const systolic = useVitalTrends('systolic_bp', days);
  const diastolic = useVitalTrends('diastolic_bp', days);

  const isLoading = systolic.isLoading || diastolic.isLoading;

  const merged = useMemo(() => {
    const sPoints = systolic.data?.points ?? [];
    const dMap = new Map((diastolic.data?.points ?? []).map((p) => [p.date, p]));
    return sPoints.map((s) => ({
      date: s.date,
      systolic: s.count > 0 ? Math.round(s.avg) : null,
      diastolic: dMap.get(s.date)?.count ? Math.round(dMap.get(s.date)!.avg) : null,
    }));
  }, [systolic.data, diastolic.data]);

  const hasData = merged.some((p) => p.systolic != null);
  const insight = systolic.data
    ? computeTrendInsight(systolic.data.points, 'systolic blood pressure', 'mmHg', 0, true)
    : null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-900">Blood Pressure Trend</h3>
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5">
          {TREND_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setDays(opt)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                days === opt ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800',
              )}
            >
              {opt}D
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="h-72 animate-pulse rounded-lg bg-zinc-100" />
        ) : !hasData ? (
          <EmptyState
            icon={<Activity className="h-5 w-5" />}
            title="No blood pressure readings yet"
            description="Log a reading to start seeing your trend here."
            className="py-16"
          />
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={merged} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="bpFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D9488" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d: string) => formatDate(d, { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 11, fill: '#71717A' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={['dataMin - 10', 'dataMax + 10']}
                  tick={{ fontSize: 11, fill: '#71717A' }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic"
                  stroke="#0D9488"
                  strokeWidth={2.5}
                  fill="url(#bpFill)"
                  dot={{ r: 3, fill: '#0D9488' }}
                  connectNulls
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic"
                  stroke="#5EEAD4"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#5EEAD4' }}
                  connectNulls
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {hasData && (
        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-600">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 rounded bg-teal-600" />
            Systolic
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 rounded bg-teal-300" />
            Diastolic
          </span>
        </div>
      )}

      {insight && insight.direction !== 'flat' && (
        <div
          className={cn(
            'mt-4 flex items-start gap-2.5 rounded-lg border p-3',
            insight.tone === 'watch'
              ? 'border-amber-200 bg-amber-50 text-amber-900'
              : 'border-emerald-200 bg-emerald-50 text-emerald-900',
          )}
        >
          {insight.direction === 'up' ? (
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <TrendingDown className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p className="text-sm">
            Systolic trending {insight.direction} <span className="font-semibold">{insight.deltaLabel}</span> over
            this period.{insight.tone === 'watch' && ' Consider a consultation.'}
          </p>
        </div>
      )}
    </div>
  );
}
