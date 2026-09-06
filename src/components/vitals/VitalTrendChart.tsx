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
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { useVitalTrends, useVitalRawWindow, useVitalInsights } from '@/hooks/use-vitals';
import { insightSeverityToTone, TONE_LINE_COLOR, TONE_LINE_COLOR_LIGHT } from '@/lib/vitals';
import { CHART_VITALS, TREND_RANGE_OPTIONS, type ChartVital, type TrendRange } from '@/lib/constants';
import { cn, formatDate, formatTime } from '@/lib/utils';
import { EmptyState } from '@/components/shared/EmptyState';
import type { InsightDirection, Vital } from '@/types';

interface SeriesPoint {
  x: string;
  primary: number | null;
  secondary: number | null;
}

interface TooltipPayloadItem {
  color: string;
  name: string;
  value: number;
}

function ChartTooltip({
  active,
  payload,
  label,
  is24h,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  is24h: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-zinc-900">
        {label ? (is24h ? formatTime(label) : formatDate(label)) : ''}
      </p>
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

function DirectionIcon({ direction }: { direction: InsightDirection }) {
  if (direction === 'up') return <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />;
  if (direction === 'down') return <TrendingDown className="mt-0.5 h-4 w-4 shrink-0" />;
  return <Minus className="mt-0.5 h-4 w-4 shrink-0" />;
}

export function VitalTrendChart() {
  const [selectedVital, setSelectedVital] = useState<ChartVital>('blood_pressure');
  const [range, setRange] = useState<TrendRange>(7);

  const meta = CHART_VITALS.find((v) => v.key === selectedVital)!;
  const isBp = selectedVital === 'blood_pressure';
  const is24h = range === '24h';
  const numericDays = typeof range === 'number' ? range : 7;

  // Day-aggregated trends (7/30/90) — disabled entirely in 24H mode.
  const primaryTrend = useVitalTrends(meta.parameter, numericDays, !is24h);
  const secondaryTrend = useVitalTrends(
    meta.secondaryParameter ?? 'diastolic_bp',
    numericDays,
    !is24h && isBp,
  );
  // Raw individual readings — only fetched in 24H mode. Reuses the existing
  // GET /vitals endpoint (confirmed by the backend to return full rows even
  // when filtered by parameter, so systolic + diastolic come off one row).
  const rawWindow = useVitalRawWindow(meta.parameter, 24, is24h);

  // Same real insights query used by the dashboard's observation/alerts
  // cards — react-query dedupes this to one shared network call.
  const { data: insightsData } = useVitalInsights();
  const paramInsight = insightsData?.insights.find((i) => i.parameter === meta.parameter);
  const tone = paramInsight ? insightSeverityToTone(paramInsight.severity) : 'neutral';
  const color = TONE_LINE_COLOR[tone];
  const lightColor = TONE_LINE_COLOR_LIGHT[tone];

  const isLoading = is24h
    ? rawWindow.isLoading
    : primaryTrend.isLoading || (isBp && secondaryTrend.isLoading);

  const series = useMemo<SeriesPoint[]>(() => {
    if (is24h) {
      const rows: Vital[] = [...(rawWindow.data ?? [])].reverse(); // API returns newest-first
      return rows
        .filter((r) => r[meta.field] != null)
        .map((r) => ({
          x: r.recordedAt,
          primary: r[meta.field] as number,
          secondary: isBp && meta.secondaryField ? ((r[meta.secondaryField] as number) ?? null) : null,
        }));
    }
    const primaryPoints = primaryTrend.data?.points ?? [];
    const secondaryMap = new Map((secondaryTrend.data?.points ?? []).map((p) => [p.date, p]));
    return primaryPoints.map((p) => ({
      x: p.date,
      primary: p.count > 0 ? Math.round(p.avg * 10) / 10 : null,
      secondary:
        isBp && secondaryMap.get(p.date)?.count
          ? Math.round(secondaryMap.get(p.date)!.avg * 10) / 10
          : null,
    }));
  }, [is24h, rawWindow.data, primaryTrend.data, secondaryTrend.data, meta, isBp]);

  const hasData = series.some((p) => p.primary != null);

  // The insights endpoint always describes the last 7 days, regardless of
  // which range is selected here — only show its callout when that window
  // actually matches what's on screen, to avoid a "7 days ago" message next
  // to a 90-day chart.
  const showInsightCallout = !is24h && numericDays === 7 && !!paramInsight;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-900">{meta.label} Trend</h3>
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5">
          {TREND_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setRange(opt)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                range === opt ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800',
              )}
            >
              {opt === '24h' ? '24H' : `${opt}D`}
            </button>
          ))}
        </div>
      </div>

      {/* Vital selector — neutral selected-state; color is reserved for
          conveying live health status on the chart itself, not for telling
          tabs apart. */}
      <div className="mt-3 flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5">
        {CHART_VITALS.map((v) => (
          <button
            key={v.key}
            onClick={() => setSelectedVital(v.key)}
            className={cn(
              'flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
              selectedVital === v.key ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800',
            )}
          >
            {v.shortLabel}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="h-72 animate-pulse rounded-lg bg-zinc-100" />
        ) : !hasData ? (
          <EmptyState
            icon={<Activity className="h-5 w-5" />}
            title={`No ${meta.label.toLowerCase()} readings yet`}
            description={
              is24h
                ? 'No readings logged in the last 24 hours.'
                : 'Log a reading to start seeing your trend here.'
            }
            className="py-16"
          />
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={series} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="vitalFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.14} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                <XAxis
                  dataKey="x"
                  tickFormatter={(v: string) => (is24h ? formatTime(v) : formatDate(v, { month: 'short', day: 'numeric' }))}
                  tick={{ fontSize: 11, fill: '#71717A' }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: is24h ? 'Time' : 'Date', position: 'insideBottom', offset: -4, style: { fontSize: 11, fill: '#A1A1AA' } }}
                />
                <YAxis
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tick={{ fontSize: 11, fill: '#71717A' }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                  label={{ value: meta.unit, angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#A1A1AA', textAnchor: 'middle' } }}
                />
                <Tooltip content={<ChartTooltip is24h={is24h} />} />
                <Area
                  type="monotone"
                  dataKey="primary"
                  name={isBp ? 'Systolic' : meta.label}
                  stroke={color}
                  strokeWidth={2.5}
                  fill="url(#vitalFill)"
                  dot={{ r: 3, fill: color }}
                  connectNulls
                  isAnimationActive={false}
                />
                {isBp && (
                  <Line
                    type="monotone"
                    dataKey="secondary"
                    name="Diastolic"
                    stroke={lightColor}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: lightColor }}
                    connectNulls
                    isAnimationActive={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {hasData && isBp && (
        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-600">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 rounded" style={{ backgroundColor: color }} />
            Systolic
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 rounded" style={{ backgroundColor: lightColor }} />
            Diastolic
          </span>
        </div>
      )}

      {showInsightCallout && (
        <div
          className={cn(
            'mt-4 flex items-start gap-2.5 rounded-lg border p-3',
            tone === 'alert'
              ? 'border-red-200 bg-red-50 text-red-900'
              : tone === 'watch'
                ? 'border-amber-200 bg-amber-50 text-amber-900'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900',
          )}
        >
          <DirectionIcon direction={paramInsight!.direction} />
          <p className="text-sm">{paramInsight!.message}</p>
        </div>
      )}
    </div>
  );
}
