import React from 'react';
import { GetStartedButton } from '@/components/ui/GetStartedButton';
import { NeonReveal } from '@/components/ui/NeonReveal';
import { ShimmerHeadline } from '@/components/ui/ShimmerHeadline';

export default function LandingPage() {
  return (
    <main className="landing">
      <NeonReveal
        className="landing-body"
        color={258}
        revealDelay={300}
        revealDuration={2400}
        verticalOffset={0.5}
        barWidth={0.82}
        barHeight={0.004}
        intensity={1.25}
        glowSpread={1.4}
      >
        <div className="landing-headline">
          <div className="landing-spotlight" aria-hidden="true" />
          <ShimmerHeadline className="landing-shimmer" text="Hey, I’m Vignesh — wanna play a game?" />
        </div>
      </NeonReveal>

      <div className="landing-actions">
        <GetStartedButton href="/games" />
      </div>
    </main>
  );
}
