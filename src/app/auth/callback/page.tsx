'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/auth/store';
import { FullScreenLoader } from '@/components/shared/FullScreenLoader';

/**
 * Google redirects the browser here after the backend has set the refresh
 * cookie. The app-wide AuthBootstrap (in providers) already calls
 * POST /auth/refresh on load; we just react to the resulting status — that
 * keeps the single-flight lock honoured (no second refresh).
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (status === 'authenticated') {
      handled.current = true;
      router.replace('/dashboard');
    } else if (status === 'unauthenticated') {
      handled.current = true;
      toast.error('Sign-in with Google did not complete. Please try again.');
      router.replace('/login');
    }
  }, [status, router]);

  return <FullScreenLoader label="Completing sign-in…" />;
}
