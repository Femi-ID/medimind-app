'use client';

import { AlertTriangle, Phone, MapPin } from 'lucide-react';
import { EMERGENCY_NUMBER } from '@/lib/constants';

/**
 * Shown when the backend flags isEmergency / triage === 'EMERGENCY'. Visually
 * distinct, calm (no flashing), and action-first. Replaces normal guidance —
 * we never try to "handle" an emergency conversationally.
 */
export function EmergencyCard({ onFindHospital }: { onFindHospital: () => void }) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border-2 border-red-600 bg-red-50 p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600">
          <AlertTriangle className="h-7 w-7 text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-red-900">
            This may be a medical emergency
          </h3>
          <ol className="mt-4 space-y-2.5">
            {[
              <>Call <strong className="font-semibold">{EMERGENCY_NUMBER}</strong> (Nigeria emergency line) immediately</>,
              <>Go to the nearest emergency department</>,
              <>If alone, alert a neighbor or bystander</>,
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-red-900">
                <span className="num flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${EMERGENCY_NUMBER}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 text-base font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Phone className="h-5 w-5" />
              Call emergency line
            </a>
            <button
              onClick={onFindHospital}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-6 text-base font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              <MapPin className="h-5 w-5" />
              Find nearest hospital
            </button>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-red-900/70">
            MediMind cannot provide guidance for potential emergencies. Please seek immediate care.
          </p>
        </div>
      </div>
    </div>
  );
}
