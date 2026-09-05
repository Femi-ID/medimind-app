import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';

const YEAR = new Date().getFullYear();

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-zinc-600">Your health, understood in context.</p>
            <p className="mt-3 text-xs text-zinc-400">© {YEAR} MediMind</p>
          </div>

          <nav aria-label="Product">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Product</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              <li><a href="#features" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">Features</a></li>
              <li><a href="#how" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">How it works</a></li>
              <li><a href="#faq" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">FAQ</a></li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Legal</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              <li><span className="text-sm text-zinc-400">Privacy</span></li>
              <li><span className="text-sm text-zinc-400">Terms</span></li>
              <li><span className="text-sm text-zinc-400">Data &amp; security</span></li>
            </ul>
          </nav>

          <nav aria-label="Support">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Support</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              <li><span className="text-sm text-zinc-400">Contact</span></li>
              <li><span className="text-sm text-zinc-400">Help center</span></li>
              <li><span className="text-sm text-zinc-400">Emergency info</span></li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-zinc-200 pt-6 sm:flex-row">
          <p className="text-xs text-zinc-500">© {YEAR} MediMind · Made with care.</p>
          <p className="text-xs text-zinc-500">Not a replacement for professional medical advice.</p>
        </div>
      </div>
    </footer>
  );
}
