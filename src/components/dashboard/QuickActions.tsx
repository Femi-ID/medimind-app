'use client';

import Link from 'next/link';
import { PlusCircle, MessageCircle, MapPin, ChevronRight } from 'lucide-react';

const ACTIONS = [
  {
    icon: PlusCircle,
    title: 'Log a vital',
    subtitle: 'Blood pressure, glucose, weight, heart rate',
  },
  {
    icon: MessageCircle,
    title: 'Start a consultation',
    subtitle: 'Ask MediMind about symptoms',
    href: '/consultation',
  },
  {
    icon: MapPin,
    title: 'Find a hospital',
    subtitle: 'Emergency & nearby care',
    href: '/hospitals',
  },
];

export function QuickActions({ onLogVital }: { onLogVital: () => void }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Quick Actions</p>
      <div className="mt-3 flex flex-col">
        {ACTIONS.map((action) => {
          const body = (
            <>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                <action.icon className="h-5 w-5 text-teal-600" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{action.title}</span>
                <span className="block truncate text-xs text-zinc-500">{action.subtitle}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
            </>
          );
          const className =
            '-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-zinc-50';

          return action.href ? (
            <Link key={action.title} href={action.href} className={className}>
              {body}
            </Link>
          ) : (
            <button key={action.title} onClick={onLogVital} className={className}>
              {body}
            </button>
          );
        })}
      </div>
    </div>
  );
}
