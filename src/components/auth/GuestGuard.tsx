'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';
import { FullScreenLoader } from '@/components/shared/FullScreenLoader';

/**
 * For public auth pages (/login, /register). If a session is already restored,
 * send the user straight to the dashboard.
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [status, router]);

  if (status === 'loading') return <FullScreenLoader />;
  if (status === 'authenticated') return <FullScreenLoader label="Taking you in…" />;
  return <>{children}</>;
}
