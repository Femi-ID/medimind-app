'use client';

import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function IncompleteProfileBanner({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
        <ShieldAlert className="h-5 w-5 text-amber-600" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-amber-900">Complete your profile to start a consultation</p>
        <p className="mt-0.5 text-sm leading-relaxed text-amber-900/80">
          MediMind needs a phone number and an emergency contact on file before it can chat with you —
          this is so help can reach you or someone close to you if a conversation turns out to be urgent.
        </p>
      </div>
      <Button size="sm" onClick={onComplete} className="shrink-0 self-center">
        Complete now
      </Button>
    </div>
  );
}
