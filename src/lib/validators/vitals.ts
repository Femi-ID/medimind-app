import { z } from 'zod';
import { VITALS } from '@/lib/constants';

const META = VITALS.reduce((acc, v) => ({ ...acc, [v.param]: v }), {} as Record<string, (typeof VITALS)[number]>);

/**
 * Kept as plain optional strings — matching exactly what <input type="number">
 * actually produces — rather than z.preprocess()'d into numbers. preprocess()
 * makes Zod's *input* type `unknown` while the *output* type is `number`;
 * zodResolver can't reconcile that split against an explicit useForm<T>()
 * generic (a well-known react-hook-form + Zod incompatibility, not a bug in
 * either library individually). Converting string -> number happens once, at
 * the API-call boundary in the component, not inside the schema.
 */
const numField = (param: string) => {
  const meta = META[param];
  return z
    .string()
    .optional()
    .refine(
      (v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= meta.min && Number(v) <= meta.max),
      `Must be between ${meta.min} and ${meta.max}`,
    );
};

export const logVitalSchema = z
  .object({
    systolicBp: numField('systolic_bp'),
    diastolicBp: numField('diastolic_bp'),
    heartRate: numField('heart_rate'),
    bloodGlucose: numField('blood_glucose'),
    weight: numField('weight'),
  })
  .refine((v) => !!(v.systolicBp || v.diastolicBp || v.heartRate || v.bloodGlucose || v.weight), {
    message: 'Enter at least one reading.',
    path: ['systolicBp'],
  })
  .refine((v) => !!v.systolicBp === !!v.diastolicBp, {
    message: 'Enter both systolic and diastolic together.',
    path: ['diastolicBp'],
  });

export type LogVitalValues = z.infer<typeof logVitalSchema>;
