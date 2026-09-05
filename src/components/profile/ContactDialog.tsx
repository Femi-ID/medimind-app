'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/auth/store';
import { useUpdateProfile } from '@/hooks/use-profile';
import { contactSchema, type ContactValues } from '@/lib/validators/profile';
import { getErrorMessage } from '@/lib/utils';

/**
 * Covers exactly the 3 fields the backend's ProfileCompleteGuard requires
 * (phoneNumber, emergencyContactName, emergencyContactPhone) — completing
 * this form is what unblocks starting a consultation.
 */
export function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    values: {
      phoneNumber: user?.phoneNumber ?? '',
      emergencyContactName: user?.emergencyContactName ?? '',
      emergencyContactPhone: user?.emergencyContactPhone ?? '',
    },
  });

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(values: ContactValues) {
    try {
      await updateProfile.mutateAsync(values);
      toast.success('Contact info saved — you can now start a consultation');
      handleClose();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save your contact info.'));
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Phone & emergency contact"
      description="Required before MediMind can start a consultation with you."
      className="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <Label htmlFor="contact-phone" className="mb-1.5">Your phone number</Label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="+234 801 234 5678"
            invalid={!!errors.phoneNumber}
            {...register('phoneNumber')}
          />
          {errors.phoneNumber && <p className="mt-1.5 text-xs text-red-600">{errors.phoneNumber.message}</p>}
        </div>

        <div className="border-t border-zinc-200 pt-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            Emergency contact
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact-ec-name" className="mb-1.5">Their name</Label>
              <Input
                id="contact-ec-name"
                placeholder="Folake Idowu"
                invalid={!!errors.emergencyContactName}
                {...register('emergencyContactName')}
              />
              {errors.emergencyContactName && (
                <p className="mt-1.5 text-xs text-red-600">{errors.emergencyContactName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="contact-ec-phone" className="mb-1.5">Their phone number</Label>
              <Input
                id="contact-ec-phone"
                type="tel"
                placeholder="+234 807 654 3210"
                invalid={!!errors.emergencyContactPhone}
                {...register('emergencyContactPhone')}
              />
              {errors.emergencyContactPhone && (
                <p className="mt-1.5 text-xs text-red-600">{errors.emergencyContactPhone.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>Cancel</Button>
          <Button type="submit" className="flex-1" loading={updateProfile.isPending}>Save</Button>
        </div>
      </form>
    </Dialog>
  );
}
