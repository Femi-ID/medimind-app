'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';
import { LandingHeader } from '@/components/marketing/LandingHeader';
import { HeroSection } from '@/components/marketing/HeroSection';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection';
import { DisclaimerBand } from '@/components/marketing/DisclaimerBand';
import { FaqSection } from '@/components/marketing/FaqSection';
import { CtaSection } from '@/components/marketing/CtaSection';
import { LandingFooter } from '@/components/marketing/LandingFooter';

/**
 * Public landing page. Anonymous visitors (the common case) see marketing
 * content immediately — no spinner, no forced detour through /login. Only a
 * genuinely restored session redirects onward, once the cookie-based check
 * resolves.
 */
export default function Home() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [status, router]);

  return (
    <div className="bg-white">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DisclaimerBand />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
