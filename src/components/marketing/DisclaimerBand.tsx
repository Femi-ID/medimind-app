import { Stethoscope } from 'lucide-react';

export function DisclaimerBand() {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50 py-8">
      <div className="mx-auto grid max-w-7xl items-center gap-4 px-6 md:grid-cols-2">
        <h2 className="flex items-center gap-2.5 text-xl font-semibold text-zinc-900">
          <Stethoscope className="h-5 w-5 text-teal-600" />
          This is guidance, not a diagnosis.
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          MediMind never diagnoses conditions or prescribes medication. It helps you notice patterns
          and decide when to see a professional.
        </p>
      </div>
    </section>
  );
}
