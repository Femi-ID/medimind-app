'use client';

import { Sparkles } from 'lucide-react';
import { useLatestVitals } from '@/hooks/use-vitals';
import { VITAL_BY_PARAM } from '@/lib/constants';
import { classifyBloodPressure, classifyVital, formatVitalValue, toneDotClass } from '@/lib/vitals';

/**
 * Honest "MediMind can see:" strip. It reflects the user's ACTUAL latest
 * vitals (the same data the backend attaches to the consultation context), so
 * the user understands what informs the guidance. Hidden entirely when there's
 * no vitals data — we don't imply context that doesn't exist.
 */
export function VitalsContextStrip() {
  const { data: latest } = useLatestVitals();

  const sys = latest?.find((v) => v.parameter === 'systolic_bp');
  const dia = latest?.find((v) => v.parameter === 'diastolic_bp');
  const hr = latest?.find((v) => v.parameter === 'heart_rate');
  const glu = latest?.find((v) => v.parameter === 'blood_glucose');
  const wt = latest?.find((v) => v.parameter === 'weight');

  const chips: { label: string; value: string; dot: string }[] = [];

  if (sys?.value != null && dia?.value != null) {
    const t = classifyBloodPressure(sys.value, dia.value).tone;
    chips.push({ label: 'BP', value: `${Math.round(sys.value)}/${Math.round(dia.value)}`, dot: toneDotClass(t) });
  }
  if (hr?.value != null) {
    chips.push({ label: 'HR', value: formatVitalValue(hr.value, 0), dot: toneDotClass(classifyVital('heart_rate', hr.value).tone) });
  }
  if (glu?.value != null) {
    chips.push({ label: 'Glucose', value: formatVitalValue(glu.value, VITAL_BY_PARAM.blood_glucose.decimals), dot: toneDotClass(classifyVital('blood_glucose', glu.value).tone) });
  }
  if (wt?.value != null) {
    chips.push({ label: 'Weight', value: formatVitalValue(wt.value, VITAL_BY_PARAM.weight.decimals), dot: toneDotClass('neutral') });
  }

  if (chips.length === 0) return null;

  return (
    <div className="shrink-0 overflow-x-auto border-b border-teal-100 bg-teal-50/70 px-4 py-2.5 sm:px-6">
      <div className="flex min-w-max items-center gap-2">
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-teal-800">
          <Sparkles className="h-3.5 w-3.5" />
          MediMind can see:
        </span>
        {chips.map((c) => (
          <span
            key={c.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-700"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
            {c.label} <span className="num font-semibold">{c.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
