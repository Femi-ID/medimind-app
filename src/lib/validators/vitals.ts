import { z } from 'zod';
import { VITALS } from '@/lib/constants';

const bp = VITALS.reduce((acc, v) => ({ ...acc, [v.param]: v }), {} as Record<string, (typeof VITALS)[number]>);

const numField = (param: string) => {
  const meta = bp[param];
  return z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z
      .number()
      .min(meta.min, `Must be at least ${meta.min}`)
      .max(meta.max, `Must be at most ${meta.max}`)
      .optional(),
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
  .refine(
    (v) =>
      v.systolicBp != null ||
      v.diastolicBp != null ||
      v.heartRate != null ||
      v.bloodGlucose != null ||
      v.weight != null,
    { message: 'Enter at least one reading.', path: ['systolicBp'] },
  )
  .refine((v) => (v.systolicBp != null) === (v.diastolicBp != null), {
    message: 'Enter both systolic and diastolic together.',
    path: ['diastolicBp'],
  });

export type LogVitalValues = z.infer<typeof logVitalSchema>;
