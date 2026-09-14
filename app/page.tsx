import React from 'react';
import { GetStartedButton } from '@/components/ui/GetStartedButton';
import { NeonReveal } from '@/components/ui/NeonReveal';

export default function LandingPage() {
  return (
    <main className="landing">
      {/* Intentionally blank — content to be added next. */}
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
        mirrored
      />

      <div className="landing-actions">
        <GetStartedButton href="/games" />
      </div>
    </main>
  );
}
