'use client';

import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { refreshAccessToken } from '@/lib/api/client';
import { getProfile } from '@/lib/api/users';
import { useAuthStore } from '@/lib/auth/store';

/**
 * Restores the session on first load: try POST /auth/refresh once (the httpOnly
 * cookie rides along). On success, fetch the profile; on failure, mark
 * unauthenticated. Runs exactly once for the app's lifetime.
 */
function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setStatus = useAuthStore((s) => s.setStatus);
  const setUser = useAuthStore((s) => s.setUser);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      const token = await refreshAccessToken();
      if (!token) {
        setStatus('unauthenticated');
        return;
      }
      try {
        const user = await getProfile();
        setAuth(token, user);
      } catch {
        // Token is valid but profile fetch failed — keep them signed in,
        // pages can refetch the profile as needed.
        setUser(null);
        setStatus('authenticated');
      }
    })();
  }, [setAuth, setStatus, setUser]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>{children}</AuthBootstrap>
      <Toaster position="top-center" richColors closeButton />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
