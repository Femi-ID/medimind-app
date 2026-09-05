import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

// Matches the backend's exact validator: /^\+?[0-9\s-]{7,20}$/
const phoneRegex = /^\+?[0-9\s-]{7,20}$/;
const phoneField = (label: string) =>
  z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().regex(phoneRegex, `Enter a valid ${label} (7-20 digits)`).optional(),
  );

export const profileEditSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(200),
  lastName: z.string().trim().min(1, 'Last name is required').max(200),
  age: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().int().min(1, 'Enter a valid age').max(120, 'Enter a valid age').optional(),
  ),
  gender: z.preprocess(
    (v) => (v === '' || v == null ? undefined : v),
    z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  ),
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
  confirmText: z.string().refine((v) => v === 'DELETE', { message: 'Type DELETE to confirm' }),
  password: z.string().min(1, 'Enter your password'),
});
export type DeleteAccountValues = z.infer<typeof deleteAccountSchema>;
