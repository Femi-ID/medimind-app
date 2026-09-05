'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useDeleteAccount, useProfileStats } from '@/hooks/use-profile';
import { deleteAccountSchema, type DeleteAccountValues } from '@/lib/validators/profile';
import { getErrorMessage } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth/store';
import { authApi } from '@/lib/api';

export function DeleteAccountDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const deleteAccount = useDeleteAccount();
  const stats = useProfileStats();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DeleteAccountValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirmText: '', password: '' },
  });
  const watchedConfirm = watch('confirmText');

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(values: DeleteAccountValues) {
    try {
      await deleteAccount.mutateAsync(values.password);
      try {
        await authApi.logout();
      } catch {
        /* ignore — clearing locally regardless */
      }
      clearAuth();
      toast.success('Your account has been deleted.');
      router.replace('/login');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete your account. Check your password.'));
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-md">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900">Delete all your data?</h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600">
            This permanently erases your profile
            {stats.vitalsLabel !== '—' ? `, ${stats.vitalsLabel} vital logs` : ''}
            {stats.consultationsLabel !== '—' ? `, ${stats.consultationsLabel} consultations` : ''}, and all
            history. <strong className="font-semibold text-zinc-900">This cannot be undone.</strong>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
        <div>
          <Label htmlFor="del-confirm" className="mb-1.5">
            Type <span className="num font-semibold text-red-700">DELETE</span> to confirm
          </Label>
          <Input
            id="del-confirm"
            autoComplete="off"
            placeholder="DELETE"
            invalid={!!errors.confirmText}
            {...register('confirmText')}
          />
          {errors.confirmText && <p className="mt-1.5 text-xs text-red-600">{errors.confirmText.message}</p>}
        </div>
        <div>
          <Label htmlFor="del-pw" className="mb-1.5">Enter your password</Label>
          <Input id="del-pw" type="password" autoComplete="off" invalid={!!errors.password} {...register('password')} />
          {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="destructive"
            className="flex-1"
            disabled={watchedConfirm !== 'DELETE'}
            loading={deleteAccount.isPending}
          >
            Delete everything
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
