'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useChangePassword } from '@/hooks/use-profile';
import { changePasswordSchema, type ChangePasswordValues } from '@/lib/validators/profile';
import { getErrorMessage } from '@/lib/utils';

export function ChangePasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(values: ChangePasswordValues) {
    try {
      await changePassword.mutateAsync(values);
      toast.success('Password changed');
      handleClose();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not change your password. Check your current password.'));
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Change password" className="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <Label htmlFor="cp-current" className="mb-1.5">Current password</Label>
          <Input id="cp-current" type="password" autoComplete="current-password" invalid={!!errors.currentPassword} {...register('currentPassword')} />
          {errors.currentPassword && <p className="mt-1.5 text-xs text-red-600">{errors.currentPassword.message}</p>}
        </div>
        <div>
          <Label htmlFor="cp-new" className="mb-1.5">New password</Label>
          <Input id="cp-new" type="password" autoComplete="new-password" invalid={!!errors.newPassword} {...register('newPassword')} />
          {errors.newPassword && <p className="mt-1.5 text-xs text-red-600">{errors.newPassword.message}</p>}
        </div>
        <div>
          <Label htmlFor="cp-confirm" className="mb-1.5">Confirm new password</Label>
          <Input id="cp-confirm" type="password" autoComplete="new-password" invalid={!!errors.confirmPassword} {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword.message}</p>}
        </div>
        <div className="flex gap-2 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>Cancel</Button>
          <Button type="submit" className="flex-1" loading={changePassword.isPending}>Update password</Button>
        </div>
      </form>
    </Dialog>
  );
}
