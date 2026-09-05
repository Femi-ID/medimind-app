'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuthStore } from '@/lib/auth/store';
import { useUpdateProfile } from '@/hooks/use-profile';
import { profileEditSchema, type ProfileEditValues } from '@/lib/validators/profile';
import { GENDER_OPTIONS } from '@/lib/constants';
import { getErrorMessage } from '@/lib/utils';

export function ProfileEditDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    values: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      age: user?.age ?? undefined,
      gender: user?.gender ?? undefined,
    },
  });

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(values: ProfileEditValues) {
    try {
      await updateProfile.mutateAsync(values);
      toast.success('Profile updated');
      handleClose();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save your profile.'));
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Edit profile" className="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="edit-firstName" className="mb-1.5">First name</Label>
            <Input id="edit-firstName" invalid={!!errors.firstName} {...register('firstName')} />
            {errors.firstName && <p className="mt-1.5 text-xs text-red-600">{errors.firstName.message}</p>}
          </div>
          <div>
            <Label htmlFor="edit-lastName" className="mb-1.5">Last name</Label>
            <Input id="edit-lastName" invalid={!!errors.lastName} {...register('lastName')} />
            {errors.lastName && <p className="mt-1.5 text-xs text-red-600">{errors.lastName.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="edit-age" className="mb-1.5">Age</Label>
            <Input id="edit-age" type="number" min={1} max={120} invalid={!!errors.age} {...register('age')} />
            {errors.age && <p className="mt-1.5 text-xs text-red-600">{errors.age.message}</p>}
          </div>
          <div>
            <Label htmlFor="edit-gender" className="mb-1.5">Gender</Label>
            <Select id="edit-gender" defaultValue="" {...register('gender')}>
              <option value="">Not set</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>Cancel</Button>
          <Button type="submit" className="flex-1" loading={updateProfile.isPending}>Save changes</Button>
        </div>
      </form>
    </Dialog>
  );
}
