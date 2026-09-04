import Link from 'next/link';
import { Check } from 'lucide-react';

const FEATURES = [
  'Longitudinal vitals tracking',
  'Context-aware AI guidance',
  'Encrypted with JWT + TLS 1.3',
  'Built for real Nigerian care contexts',
];

/** Two-column auth layout: teal brand panel (desktop) + form column. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — hidden on small screens */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-800 to-teal-900 p-12 lg:flex">
        <svg
          className="absolute -right-24 -top-24 h-[520px] w-[520px] text-white/[0.04]"
          viewBox="0 0 200 200"
          fill="currentColor"
          aria-hidden
        >
          <circle cx="100" cy="100" r="100" />
        </svg>
        <svg
          className="absolute bottom-40 right-8 w-[420px] text-teal-300/10"
          viewBox="0 0 400 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M0 40h60l20-30 30 60 25-50 15 20h40l20-24 28 48 22-40 15 16h90" />
        </svg>

        <div className="relative flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M2 12h4l2.5-6 4 12L15 9l1.5 3H22" />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white">MediMind</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white text-balance">
            Your health, understood in context.
          </h2>
          <p className="mt-5 text-lg leading-[1.55] text-teal-100 text-pretty">
            MediMind reads your vitals history alongside what you&apos;re feeling right now. Every
            observation starts from what it already knows about you.
          </p>
        </div>

        <ul className="relative flex flex-col gap-3">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-teal-50">
              <Check className="h-4 w-4 shrink-0 text-teal-300" />
              {f}
            </li>
          ))}
        </ul>
      </aside>

      {/* Form column */}
      <main className="flex flex-col justify-center px-6 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m12 19-7-7 7-7M19 12H5" />
            </svg>
            Back to home
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
