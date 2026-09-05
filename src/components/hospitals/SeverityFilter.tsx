'use client';

import { cn } from '@/lib/utils';
import type { SeverityParam } from '@/types';

const OPTIONS: { value: SeverityParam; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
];

export function SeverityFilter({
  value,
  onChange,
}: {
  value: SeverityParam;
  onChange: (v: SeverityParam) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === opt.value ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
