'use client';

import { Button } from '@/components/ui/button';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-2xl font-semibold text-zinc-900">Something went wrong</h1>
      <p className="max-w-sm text-sm text-zinc-600">
        An unexpected error occurred. You can try again, or head back and retry your last action.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
