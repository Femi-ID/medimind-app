import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

// Version-proof email check (avoids zod v3/v4 `.email()` differences).
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailField = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .refine((v) => emailRegex.test(v), 'Enter a valid email address');

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(200),
  lastName: z.string().trim().min(1, 'Last name is required').max(200),
  email: emailField,
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
  // Plain string union (native <select> always yields a string, '' meaning
  // "not selected") instead of z.preprocess() — see LogVitalDialog's
  // validator for why preprocess is avoided throughout this app now.
  gender: z.enum(['', 'MALE', 'FEMALE', 'OTHER']),
  age: z
    .string()
    .refine((v) => !v || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 120), 'Enter a valid age'),
  // `.trim()` here is deliberate, not cosmetic: a bare `(v) => v === true`
  // predicate gets auto-narrowed by TypeScript to the literal type `true`,
  // which then can't be satisfied by a `boolean` default value of `false` —
  // this exact pattern broke the Vercel build. Boolean(v) sidesteps it.
  agreeToTerms: z.boolean().refine((v) => Boolean(v), {
    message: 'Please accept the terms to continue.',
  }),
});
export type RegisterValues = z.infer<typeof registerSchema>;
