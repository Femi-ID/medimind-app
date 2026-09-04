'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Logo } from './Logo';

/**
 * If this is still showing after a few seconds, it's almost always the
 * free-tier backend waking from idle (not a broken app) — say so, so a slow
 * cold start doesn't look like a hang.
 */
export function FullScreenLoader({ label = 'Loading…' }: { label?: string }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Logo />
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Spinner className="h-4 w-4" />
        {label}
      </div>
      {slow && (
        <p className="max-w-xs text-xs text-zinc-400">
          Taking longer than usual — the server may be waking up from idle. This can take up to a
          minute on first load.
        </p>
      )}
    </div>
  );
}
