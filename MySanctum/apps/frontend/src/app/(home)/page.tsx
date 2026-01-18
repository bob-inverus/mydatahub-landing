'use client';

import { BackgroundAALChecker } from '@/components/auth/background-aal-checker';
import { LandingPage } from '@/components/home/landing-page';

export default function Home() {
  return (
    <BackgroundAALChecker>
      <LandingPage />
    </BackgroundAALChecker>
  );
}
