import { TrendingUp, MapPin, ShieldAlert } from 'lucide-react';

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Trend-aware',
    description:
      'Your blood pressure this week matters more than a single reading. MediMind weighs the pattern, not the snapshot.',
  },
  {
    icon: MapPin,
    title: 'Localized',
    description:
      'Guidance calibrated for Nigerian care contexts, not imported. Including where to actually go next.',
  },
  {
    icon: ShieldAlert,
    title: 'Safety-first',
    description: 'Emergency symptoms get flagged instantly, before anything else runs. No queue, no delay.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-y border-zinc-200 bg-zinc-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-zinc-900">
            Most symptom checkers don&apos;t know anything about you.
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-zinc-600">
            Traditional tools evaluate your symptoms cold — a fresh questionnaire every time, blind
            to your history, your trends, and where you actually live. MediMind starts from what it
            already knows about you.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                <f.icon className="h-5 w-5 text-teal-600" />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
