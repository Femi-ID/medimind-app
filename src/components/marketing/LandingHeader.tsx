'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 h-16 border-b transition-colors duration-200 ${
        scrolled ? 'border-zinc-200 bg-white/95' : 'border-transparent bg-white/80'
      } backdrop-blur-md`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          <a href="#features" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
            Features
          </a>
          <a href="#how" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
            How it works
          </a>
          <a href="#faq" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden h-10 px-4 sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild className="h-10 px-4">
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
