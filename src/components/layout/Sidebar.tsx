'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageCircle,
  MapPin,
  User as UserIcon,
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen,
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

interface SidebarContentProps {
  onNavigate?: () => void;
  /** Icon-only rail mode. Only meaningful on the desktop rail — the mobile
   *  drawer always renders expanded since it's already an overlay. */
  collapsed?: boolean;
}

/** Sidebar contents, shared between the fixed desktop rail and the mobile slide-over. */
export function SidebarContent({ onNavigate, collapsed = false }: SidebarContentProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  function NavLink({ href, label, icon: Icon }: (typeof NAV)[number]) {
    const active = pathname === href || pathname?.startsWith(href + '/');
    return (
      <Link
        href={href}
        onClick={onNavigate}
        title={collapsed ? label : undefined}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
          collapsed && 'justify-center px-2',
          active
            ? 'bg-teal-50 font-medium text-teal-900'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
        )}
      >
        <Icon className={cn('h-5 w-5 shrink-0', active && 'text-teal-600')} />
        {!collapsed && label}
      </Link>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex items-center gap-2.5 p-4', collapsed && 'justify-center px-2')}>
        <Logo showText={!collapsed} />
      </div>

      <nav className="flex-1 overflow-y-auto px-4" aria-label="Primary">
        {!collapsed && (
          <p className="mb-2 mt-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Main
          </p>
        )}
        <div className={cn('flex flex-col gap-1', collapsed && 'mt-2')}>
          {NAV.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        {!collapsed && (
          <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Account
          </p>
        )}
        <div className={cn('flex flex-col gap-1', collapsed && 'mt-2')}>
          {ACCOUNT_NAV.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </nav>

      <div className="mt-4 border-t border-zinc-200 p-4">
        <Link
          href="/profile"
          onClick={onNavigate}
          title={collapsed ? fullName(user) || 'Your account' : undefined}
          className={cn(
            'group flex w-full items-center gap-3 rounded-lg text-left transition-colors hover:bg-zinc-50',
            collapsed && 'justify-center',
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
            {initials(user)}
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-900">
                  {fullName(user) || 'Your account'}
                </span>
                <span className="block truncate text-xs text-zinc-500">{user?.email}</span>
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-zinc-600" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
}

/**
 * Fixed desktop rail — hidden below md, per the mockup. Collapsible to an
 * icon-only rail via the toggle in its header; state lives here since only
 * this rail (not the mobile drawer) needs to reclaim horizontal space.
 */
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 border-r border-zinc-200 bg-white transition-[width] duration-200 md:flex',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="relative flex w-full flex-col">
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-800"
        >
          {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
        </button>
        <SidebarContent collapsed={collapsed} />
      </div>
    </aside>
  );
}
