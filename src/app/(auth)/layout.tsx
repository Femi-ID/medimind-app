import { GuestGuard } from '@/components/auth/GuestGuard';
import { AuthShell } from '@/components/auth/AuthShell';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <AuthShell>{children}</AuthShell>
    </GuestGuard>
  );
}
