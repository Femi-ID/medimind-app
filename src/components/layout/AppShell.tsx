'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar, SidebarContent } from './Sidebar';
import { Logo } from '@/components/shared/Logo';

/**
 * Protected-area shell: fixed sidebar on desktop (md+, matching the mockup),
 * plus a top bar + slide-over nav on mobile (the mockup has no mobile nav at
 * all — leaving small screens without navigation would be a real gap, not
 * just a style deviation, so this is added).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      {/* Mobile slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-zinc-900/40" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
          <Logo />
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
