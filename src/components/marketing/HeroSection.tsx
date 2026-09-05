import Link from 'next/link';
import { Activity, TrendingUp, Lock, Timer, Hospital, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold tracking-wide text-teal-700">
            <Sparkles className="h-3.5 w-3.5" />
            Preliminary health guidance
          </span>
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-[60px]">
            Understand your symptoms in context, not in isolation.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-[1.55] text-zinc-600">
            MediMind reads your vitals history alongside what you&apos;re feeling right now, so its
            guidance actually knows you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/register">Get started free</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#how">How it works</a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-zinc-400" />
              Encrypted in transit
            </span>
            <span className="text-zinc-300" aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Timer className="h-4 w-4 text-zinc-400" />
              Sub-second response
            </span>
            <span className="text-zinc-300" aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Hospital className="h-4 w-4 text-zinc-400" />
              Built for Nigeria
            </span>
          </div>
        </div>

        <div className="relative lg:col-span-2">
          <div
            className="absolute -inset-8 hidden rounded-2xl bg-teal-50 lg:block"
            aria-hidden
          />
          <div className="mx-auto max-w-md -rotate-1 rounded-2xl border border-zinc-200 bg-white p-5 shadow-md">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-600">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M2 12h4l2.5-6 4 12L15 9l1.5 3H22" />
                </svg>
              </span>
              <span className="text-sm font-semibold text-zinc-900">MediMind</span>
              <span className="ml-auto text-xs text-zinc-400">Just now</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                <Activity className="h-3.5 w-3.5" />
                BP 138/88 · this week
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                <TrendingUp className="h-3.5 w-3.5" />
                Trending up
              </span>
            </div>
            <div className="mt-3 rounded-xl bg-zinc-50 p-3">
              <p className="text-sm italic text-zinc-600">
                &ldquo;I&apos;ve had a mild headache since yesterday and I feel a bit dizzy when I
                stand.&rdquo;
              </p>
            </div>
            <div className="mt-3">
              <p className="text-sm leading-relaxed text-zinc-900">
                Here&apos;s what I notice: your blood pressure readings have been climbing for six
                days, and dizziness on standing can be related. This looks elevated, not an
                emergency — but it&apos;s worth checking.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Consider seeing a doctor this week. Would you like nearby clinics in Surulere?
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <span className="inline-flex h-8 items-center rounded-lg bg-teal-600 px-3 text-xs font-medium text-white">
                Find clinics nearby
              </span>
              <span className="inline-flex h-8 items-center rounded-lg border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700">
                Log today&apos;s BP
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
