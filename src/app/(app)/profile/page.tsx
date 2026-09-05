'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/lib/auth/store';
import { Button } from '@/components/ui/button';
import { ProfileHeaderCard } from '@/components/profile/ProfileHeaderCard';
import { PreferencesCard } from '@/components/profile/PreferencesCard';
import { DataPrivacyCard } from '@/components/profile/DataPrivacyCard';
import { IncompleteProfileBanner } from '@/components/profile/IncompleteProfileBanner';
import { ProfileEditDialog } from '@/components/profile/ProfileEditDialog';
import { ContactDialog } from '@/components/profile/ContactDialog';
import { ChangePasswordDialog } from '@/components/profile/ChangePasswordDialog';
import { DeleteAccountDialog } from '@/components/profile/DeleteAccountDialog';

function ProfilePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const { signOut } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const reason = searchParams.get('reason');
  const hasContact = !!(user?.phoneNumber && user?.emergencyContactName && user?.emergencyContactPhone);
  const showBanner = reason === 'consultation' && !hasContact;

  // If they arrived needing to complete their profile, open the form
  // immediately — no hunting for the right settings row.
  useEffect(() => {
    if (showBanner) setContactOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSignOut() {
    await signOut();
    toast.success('Signed out');
    router.replace('/login');
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <div className="mb-6">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">Account</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-900">Your profile</h1>
        <p className="mt-1.5 text-sm text-zinc-500">Manage your account, preferences, and data.</p>
      </div>

      {showBanner && <IncompleteProfileBanner onComplete={() => setContactOpen(true)} />}

      <ProfileHeaderCard onEdit={() => setEditOpen(true)} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PreferencesCard onEditContact={() => setContactOpen(true)} />
        <DataPrivacyCard onChangePassword={() => setPasswordOpen(true)} onDelete={() => setDeleteOpen(true)} />
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-900">Sign out of MediMind</p>
          <p className="mt-0.5 text-xs text-zinc-500">You&apos;ll need to sign in again to access your data.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleSignOut} className="shrink-0">
          <LogOut className="h-4 w-4 text-zinc-500" />
          Sign out
        </Button>
      </div>

      <ProfileEditDialog open={editOpen} onClose={() => setEditOpen(false)} />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </div>
  );
}

export default function ProfilePage() {
  // useSearchParams requires a Suspense boundary per Next.js's App Router.
  return (
    <Suspense fallback={null}>
      <ProfilePageInner />
    </Suspense>
  );
}
