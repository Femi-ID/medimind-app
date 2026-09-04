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
  gender: z.preprocess(
    (v) => (v === '' || v == null ? undefined : v),
    z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  ),
  age: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().int('Enter a whole number').min(1, 'Enter a valid age').max(120, 'Enter a valid age').optional(),
  ),
  agreeToTerms: z
    .boolean()
    .refine((v) => v === true, { message: 'Please accept the terms to continue.' }),
});
export type RegisterValues = z.infer<typeof registerSchema>;
