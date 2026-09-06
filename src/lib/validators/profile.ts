import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

// Matches the backend's exact validator: /^\+?[0-9\s-]{7,20}$/
const phoneRegex = /^\+?[0-9\s-]{7,20}$/;

export const profileEditSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(200),
  lastName: z.string().trim().min(1, 'Last name is required').max(200),
  // Plain strings, not z.preprocess()'d — see LogVitalDialog's validator for
  // why: preprocess splits Zod's input/output types in a way zodResolver
  // can't reconcile against an explicit useForm<T>() generic.
  age: z
    .string()
    .refine((v) => !v || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 120), 'Enter a valid age'),
  gender: z.enum(['', 'MALE', 'FEMALE', 'OTHER']),
});
export type ProfileEditValues = z.infer<typeof profileEditSchema>;

// Mirrors the exact 3 fields ProfileCompleteGuard checks — phoneNumber
// required (not optional) here since this dialog's whole purpose is to
// satisfy that guard.
export const contactSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Enter a valid phone number (7-20 digits)'),
  emergencyContactName: z.string().trim().min(1, 'Emergency contact name is required').max(120),
  emergencyContactPhone: z
    .string()
    .trim()
    .min(1, "Emergency contact's phone is required")
    .regex(phoneRegex, 'Enter a valid phone number (7-20 digits)'),
});
export type ContactValues = z.infer<typeof contactSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z.string().min(PASSWORD_MIN_LENGTH, `Must be at least ${PASSWORD_MIN_LENGTH} characters`),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  // `.trim()` is deliberate, not cosmetic — see the comment on `agreeToTerms`
  // in validators/auth.ts. A bare `(v) => v === 'DELETE'` predicate gets
  // auto-narrowed by TypeScript to the literal type "DELETE", which then
  // can't be satisfied by a `string` default value of '' — this exact
  // pattern is what broke the Vercel build.
  confirmText: z.string().refine((v) => v.trim() === 'DELETE', { message: 'Type DELETE to confirm' }),
  password: z.string().min(1, 'Enter your password'),
});
export type DeleteAccountValues = z.infer<typeof deleteAccountSchema>;
