'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Search, Bell, Plus } from 'lucide-react';
import { useAuthStore } from '@/lib/auth/store';
import { useLatestVitals } from '@/hooks/use-vitals';
import { VITALS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { VitalCard, VitalCardSkeleton } from '@/components/vitals/VitalCard';
import { VitalTrendChart } from '@/components/vitals/VitalTrendChart';
import { LogVitalDialog } from '@/components/vitals/LogVitalDialog';
import { ObservationBanner } from '@/components/dashboard/ObservationBanner';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AlertsInsights } from '@/components/dashboard/AlertsInsights';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ErrorState } from '@/components/shared/ErrorState';

function greeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [logOpen, setLogOpen] = useState(false);
  const { data: latest, isLoading, isError, refetch } = useLatestVitals();

  const now = new Date();
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const timeLabel = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  // The 4 dashboard cards: BP is one combined card (systolic drives it, paired with diastolic).
  const cardMetas = VITALS.filter((v) => v.param !== 'diastolic_bp');

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
      {/* Header */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Dashboard</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-zinc-900">
            {greeting(now.getHours())}{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {dateLabel} · {timeLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              disabled
              placeholder="Search coming soon…"
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-400 placeholder:text-zinc-400"
            />
          </div>
          <button
            aria-label="Notifications"
            onClick={() => toast('Notifications are coming soon.')}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Button onClick={() => setLogOpen(true)}>
            <Plus className="h-4 w-4" />
            Log vital
          </Button>
        </div>
      </header>

      {/* Observation + Quick actions */}
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <ObservationBanner />
        <QuickActions onLogVital={() => setLogOpen(true)} />
      </section>

      {/* Vital cards */}
      <section className="mt-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Your vitals</h2>
            <p className="mt-1 text-sm text-zinc-500">Last recorded values</p>
          </div>
        </div>

        {isError ? (
          <div className="mt-4">
            <ErrorState onRetry={() => refetch()} />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
            {isLoading
              ? cardMetas.map((m) => <VitalCardSkeleton key={m.param} />)
              : cardMetas.map((meta) => (
                  <VitalCard
                    key={meta.param}
                    meta={meta}
                    latest={latest?.find((v) => v.parameter === meta.param)}
                    pairLatest={
                      meta.param === 'systolic_bp'
                        ? latest?.find((v) => v.parameter === 'diastolic_bp')
                        : undefined
                    }
                    onLog={() => setLogOpen(true)}
                  />
                ))}
          </div>
        )}
      </section>

      {/* Trend chart + Alerts */}
      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VitalTrendChart />
        </div>
        <AlertsInsights />
      </section>

      <RecentActivity />

      <LogVitalDialog open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}
