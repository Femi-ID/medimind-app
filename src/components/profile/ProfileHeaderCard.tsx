'use client';

import { BadgeCheck, Mail, Phone, Calendar, Pencil } from 'lucide-react';
import { useAuthStore } from '@/lib/auth/store';
import { fullName, initials, formatDate } from '@/lib/utils';
import { useProfileStats } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfileHeaderCard({ onEdit }: { onEdit: () => void }) {
  const user = useAuthStore((s) => s.user);
  const stats = useProfileStats();

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="h-24 bg-gradient-to-r from-teal-700 to-teal-800" />
      <div className="px-5 pb-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <span className="num -mt-12 flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-teal-100 text-3xl font-semibold text-teal-800">
            {initials(user)}
          </span>
          <div className="min-w-0 flex-1 sm:pb-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900">{fullName(user) || 'Your name'}</h2>
              {user?.emailVerified && <BadgeCheck className="h-5 w-5 shrink-0 text-teal-600" />}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-sm text-zinc-600">
                <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                {user?.email}
              </span>
              {user?.phoneNumber && (
                <span className="inline-flex items-center gap-1.5 text-sm text-zinc-600">
                  <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
                  {user.phoneNumber}
                </span>
              )}
            </div>
            {user?.createdAt && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-500">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                Member since {formatDate(user.createdAt, { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={onEdit} className="shrink-0 sm:pb-0">
            <Pencil className="h-4 w-4 text-zinc-500" />
            Edit profile
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 divide-x divide-zinc-200 rounded-xl border border-zinc-200">
          <StatCell label="Vitals logged" value={stats.vitalsLabel} loading={stats.isLoading} />
          <StatCell label="AI consultations" value={stats.consultationsLabel} loading={stats.isLoading} />
        </div>
      </div>
    </div>
  );
}

function StatCell({ label, value, loading }: { label: string; value: string; loading: boolean }) {
  return (
    <div className="py-4 text-center">
      {loading ? (
        <Skeleton className="mx-auto h-7 w-10" />
      ) : (
        <p className="num text-2xl font-semibold text-zinc-900">{value}</p>
      )}
      <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
    </div>
  );
}
