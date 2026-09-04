import { cn } from '@/lib/utils';

/** MediMind wordmark + heartbeat glyph (matches the mockups). */
export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M2 12h4l2.5-6 4 12L15 9l1.5 3H22" />
        </svg>
      </span>
      {showText && (
        <span className="font-display text-lg font-bold tracking-tight text-zinc-900">
          MediMind
        </span>
      )}
    </span>
  );
}
