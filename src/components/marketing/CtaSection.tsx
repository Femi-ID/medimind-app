import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className="bg-teal-900 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
          Ready to understand your health in context?
        </h2>
        <p className="mt-4 text-lg text-teal-100">Free to sign up. Takes under a minute.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="bg-white text-teal-900 hover:bg-teal-50" asChild>
            <Link href="/register">Get started</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
