'use client';

import Link from 'next/link';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { PlusCircle } from 'lucide-react';
import { cn, formatRelative } from '@/lib/utils';
import { classifyBloodPressure, classifyVital, formatVitalValue, toneBadgeClass, toneDotClass } from '@/lib/vitals';
import { useVitalTrends } from '@/hooks/use-vitals';
import type { VitalLatestEntry, VitalParameter } from '@/types';
import type { VitalMeta } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

interface VitalCardProps {
  meta: VitalMeta;
  latest: VitalLatestEntry | undefined;
  /** Only present on the combined BP card. */
  pairLatest?: VitalLatestEntry;
  onLog: () => void;
}

const SPARKLINE_PARAM_COLOR: Record<string, string> = {
  good: '#10B981',
  watch: '#F59E0B',
  alert: '#DC2626',
  neutral: '#71717A',
};

function Sparkline({ parameter, color }: { parameter: VitalParameter; color: string }) {
  const { data } = useVitalTrends(parameter, 7);
  const points = (data?.points ?? []).filter((p) => p.count > 0);

  if (points.length < 2) {
    return <div className="mt-3 h-10 w-full" aria-hidden />;
  }

  return (
    <div className="mt-3 h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${parameter}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="avg"
            stroke={color}
            strokeWidth={2}
            fill={`url(#spark-${parameter})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VitalCard({ meta, latest, pairLatest, onLog }: VitalCardProps) {
  const isBp = meta.param === 'systolic_bp';
  const hasValue = latest?.value != null && (!isBp || pairLatest?.value != null);

  if (!hasValue) {
    return (
      <button
        onClick={onLog}
        className="flex flex-col items-start rounded-xl border border-dashed border-zinc-300 bg-white p-5 text-left transition-colors hover:border-teal-300 hover:bg-teal-50/40"
      >
        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
          <span className={cn('h-2 w-2 rounded-full', toneDotClass('neutral'))} />
          {isBp ? 'Blood Pressure' : meta.label}
        </span>
        <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-teal-700">
          <PlusCircle className="h-4 w-4" />
          Log your first reading
        </span>
      </button>
    );
  }

  const status = isBp
    ? classifyBloodPressure(latest!.value!, pairLatest!.value!)
    : classifyVital(meta.param, latest!.value!);

  const displayValue = isBp
    ? `${formatVitalValue(latest!.value!, 0)}/${formatVitalValue(pairLatest!.value!, 0)}`
    : formatVitalValue(latest!.value!, meta.decimals);

  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onLog();
      }}
      className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
          <span className={cn('h-2 w-2 rounded-full', toneDotClass(status.tone))} />
          {isBp ? 'Blood Pressure' : meta.label}
        </span>
        <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', toneBadgeClass(status.tone))}>
          {status.label}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="num text-4xl font-semibold text-zinc-900">{displayValue}</span>
      </div>
      <span className="text-xs text-zinc-500">{meta.unit}</span>
      <Sparkline parameter={meta.param} color={SPARKLINE_PARAM_COLOR[status.tone]} />
      <p className="mt-2 text-xs text-zinc-500">Logged {formatRelative(latest!.recordedAt)}</p>
    </Link>
  );
}

export function VitalCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-9 w-20" />
      <Skeleton className="mt-2 h-3 w-10" />
      <Skeleton className="mt-3 h-10 w-full" />
      <Skeleton className="mt-2 h-3 w-24" />
    </div>
  );
}
