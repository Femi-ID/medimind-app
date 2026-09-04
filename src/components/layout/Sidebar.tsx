'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageCircle,
  MapPin,
  User as UserIcon,
  ChevronsUpDown,
} from 'lucide-react';
import { cn, fullName, initials } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth/store';
import { Logo } from '@/components/shared/Logo';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/consultation', label: 'Consultation', icon: MessageCircle },
  { href: '/hospitals', label: 'Hospitals', icon: MapPin },
];

const ACCOUNT_NAV = [{ href: '/profile', label: 'Profile', icon: UserIcon }];

/** Sidebar contents, shared between the fixed desktop rail and the mobile slide-over. */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  function NavLink({ href, label, icon: Icon }: (typeof NAV)[number]) {
    const active = pathname === href || pathname?.startsWith(href + '/');
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
          active
            ? 'bg-teal-50 font-medium text-teal-900'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
        )}
      >
        <Icon className={cn('h-5 w-5 shrink-0', active && 'text-teal-600')} />
        {label}
      </Link>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 p-4">
        <Logo showText />
      </div>

      <nav className="flex-1 overflow-y-auto px-4" aria-label="Primary">
        <p className="mb-2 mt-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Main
        </p>
        <div className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Account
        </p>
        <div className="flex flex-col gap-1">
          {ACCOUNT_NAV.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </nav>

      <div className="mt-4 border-t border-zinc-200 p-4">
        <Link
          href="/profile"
          onClick={onNavigate}
          className="group flex w-full items-center gap-3 rounded-lg text-left transition-colors hover:bg-zinc-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
            {initials(user)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-zinc-900">
              {fullName(user) || 'Your account'}
            </span>
            <span className="block truncate text-xs text-zinc-500">{user?.email}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-zinc-600" />
        </Link>
      </div>
    </div>
  );
}

/** Fixed desktop rail — hidden below md, per the mockup. */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-zinc-200 bg-white md:flex">
      <SidebarContent />
    </aside>
  );
}
