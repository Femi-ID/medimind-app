import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Is MediMind a substitute for seeing a doctor?',
    a: 'No. MediMind gives preliminary observations based on your symptoms and vitals history — it never diagnoses or prescribes. Its job is to help you notice patterns early and decide when a professional visit is worth it.',
  },
  {
    q: 'How is my health data protected?',
    a: 'Your vitals and conversations are encrypted in transit and stored securely. Your data is never sold, and you can export or delete it at any time.',
  },
  {
    q: 'Which languages are supported?',
    a: 'MediMind currently works in English, including Nigerian English phrasing. Support for Yoruba, Hausa, and Igbo is on the roadmap.',
  },
  {
    q: 'How does the AI know my vitals history?',
    a: 'Every reading you log — blood pressure, glucose, weight, heart rate — becomes part of your context. When you describe a symptom, MediMind reads your recent trends alongside it before responding.',
  },
  {
    q: 'What happens if I describe an emergency?',
    a: 'Emergency symptoms are screened first, before anything else runs. If MediMind detects one, it immediately shows emergency guidance and nearby hospitals instead of a normal reply.',
  },
  {
    q: 'Is it free?',
    a: 'Yes — signing up and core features are free. Takes under a minute.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-zinc-900">
          Questions people ask.
        </h2>
        <div className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">
          {FAQS.map((item, i) => (
            <details key={item.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-medium text-zinc-900 transition-colors hover:text-teal-700 [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="pb-5 text-sm leading-relaxed text-zinc-600">{item.a}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
