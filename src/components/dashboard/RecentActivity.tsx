'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, MessageCircle, Scale, HeartPulse, Droplet } from 'lucide-react';
import { useRecentVitals } from '@/hooks/use-vitals';
import { consultationApi } from '@/lib/api';
import { formatRelative } from '@/lib/utils';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

interface FeedEntry {
  key: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  detail: string;
  timestamp: string;
}

/**
 * Merges two real sources — recent vitals rows and recent consultation
 * sessions — into one timeline sorted by recency. The mockup shows the same
 * blended feed; unlike the mockup's static rows, every entry here is a real
 * record, so a fresh account correctly shows an empty state.
 */
export function RecentActivity() {
  const { data: vitals, isLoading: vitalsLoading } = useRecentVitals(10);
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['consultations', 'sessions', 'recent'],
    queryFn: () => consultationApi.listSessions(5, 0),
    staleTime: 30_000,
  });

  const isLoading = vitalsLoading || sessionsLoading;

  const entries = useMemo<FeedEntry[]>(() => {
    const out: FeedEntry[] = [];

    for (const v of vitals ?? []) {
      if (v.systolicBp != null || v.diastolicBp != null) {
        out.push({
          key: `${v.id}-bp`,
          icon: Activity,
          iconBg: 'bg-red-50',
          iconColor: 'text-red-600',
          title: 'Blood pressure logged',
          detail: `${v.systolicBp ?? '—'}/${v.diastolicBp ?? '—'} mmHg`,
          timestamp: v.recordedAt,
        });
      }
      if (v.heartRate != null) {
        out.push({
          key: `${v.id}-hr`,
          icon: HeartPulse,
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          title: 'Heart rate logged',
          detail: `${v.heartRate} bpm`,
          timestamp: v.recordedAt,
        });
      }
      if (v.bloodGlucose != null) {
        out.push({
          key: `${v.id}-gl`,
          icon: Droplet,
          iconBg: 'bg-teal-50',
          iconColor: 'text-teal-600',
          title: 'Glucose logged',
          detail: `${v.bloodGlucose} mmol/L`,
          timestamp: v.recordedAt,
        });
      }
      if (v.weight != null) {
        out.push({
          key: `${v.id}-w`,
          icon: Scale,
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          title: 'Weight logged',
          detail: `${v.weight} kg`,
          timestamp: v.recordedAt,
        });
      }
    }

    for (const s of sessions?.sessions ?? []) {
      out.push({
        key: s.id,
        icon: MessageCircle,
        iconBg: 'bg-teal-50',
        iconColor: 'text-teal-600',
        title: 'Consultation',
        detail: s.lastMessage?.content?.slice(0, 60) || s.title || 'New session',
        timestamp: s.updatedAt,
      });
    }

    return out.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);
  }, [vitals, sessions]);

  return (
    <section className="mt-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Recent Activity</p>

      {isLoading ? (
        <div className="mt-3 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            icon={<Activity className="h-5 w-5" />}
            title="No activity yet"
            description="Log a vital or start a consultation to see it show up here."
          />
        </div>
      ) : (
        <div className="mt-3 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {entries.map((e) => (
            <div key={e.key} className="flex items-center gap-4 px-5 py-3.5">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${e.iconBg}`}>
                <e.icon className={`h-4 w-4 ${e.iconColor}`} />
              </span>
              <span className="w-40 shrink-0 truncate text-sm font-medium text-zinc-900">{e.title}</span>
              <span className="num truncate text-sm text-zinc-600">{e.detail}</span>
              <span className="ml-auto shrink-0 text-sm text-zinc-500">{formatRelative(e.timestamp)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
