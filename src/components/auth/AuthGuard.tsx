'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';
import { FullScreenLoader } from '@/components/shared/FullScreenLoader';

/**
 * Client-side protection for the (app) route group. While the initial refresh
 * is in flight we show a splash; unauthenticated users are bounced to /login.
 * (We use a client guard rather than middleware because tokens live in memory,
 * not in a cookie the server can read.)
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  if (status !== 'authenticated') {
    return <FullScreenLoader label="Checking your session…" />;
  }
  return <>{children}</>;
}
