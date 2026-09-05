import { MessageCircle, Activity, MapPin, ArrowUp } from 'lucide-react';

const STEPS = [
  { title: 'Log your vitals', description: 'Blood pressure, weight, glucose, heart rate. As often as you like.' },
  { title: 'Describe how you feel', description: 'Type your symptoms in plain words. No forms.' },
  { title: 'Get contextual guidance', description: 'MediMind reads your history and tells you what it notices.' },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-balance text-center font-display text-3xl font-semibold leading-tight text-zinc-900">
          Three steps to smarter health guidance.
        </h2>

        <div className="mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="text-center">
              <span className="num mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 font-display text-lg font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-zinc-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Illustrative product preview — not a live embed. */}
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex h-11 items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4">
            <span className="h-3 w-3 rounded-full bg-zinc-200" />
            <span className="h-3 w-3 rounded-full bg-zinc-200" />
            <span className="h-3 w-3 rounded-full bg-zinc-200" />
            <span className="ml-3 text-xs text-zinc-400">medimind.app — Chat</span>
          </div>
          <div className="grid sm:grid-cols-[200px_1fr]">
            <aside className="hidden border-r border-zinc-200 bg-white p-3 sm:block" aria-hidden>
              <div className="flex items-center gap-2.5 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-900">
                <MessageCircle className="h-4 w-4 text-teal-600" />
                Chat
              </div>
              <div className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-600">
                <Activity className="h-4 w-4" />
                Vitals
              </div>
              <div className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-600">
                <MapPin className="h-4 w-4" />
                Hospitals
              </div>
            </aside>
            <div className="bg-zinc-50/50 p-5">
              <div className="flex justify-end">
                <div className="max-w-sm rounded-2xl rounded-br-md bg-teal-600 px-4 py-2.5 text-sm text-white">
                  My sugar level felt off this morning after breakfast, slight blurry vision too.
                </div>
              </div>
              <div className="mt-4 flex max-w-lg gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M2 12h4l2.5-6 4 12L15 9l1.5 3H22" />
                  </svg>
                </span>
                <div className="rounded-2xl rounded-tl-md border border-zinc-200 bg-white px-4 py-3 shadow-sm">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                      Glucose 165 mg/dL · 8:12 AM
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Above your usual range
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-900">
                    Here&apos;s what I notice: this morning&apos;s reading is higher than your 30-day
                    average of 112 mg/dL, and blurry vision can go with elevated glucose. This is a
                    preliminary observation, not a diagnosis.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    If it stays above 160 by midday, consider seeing a doctor today.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex h-11 items-center rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-400">
                Describe how you&apos;re feeling…
                <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
                  <ArrowUp className="h-4 w-4 text-white" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
