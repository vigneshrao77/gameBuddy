import React from 'react';
import { GetStartedButton } from '@/components/ui/GetStartedButton';
import { NeonReveal } from '@/components/ui/NeonReveal';
import { ShimmerHeadline } from '@/components/ui/ShimmerHeadline';
import LightRays from '@/components/ui/LightRays';
import Pyramid from '@/components/ui/Pyramid';

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
          <div 
            style={{ 
              position: 'absolute', 
              left: '50%', 
              bottom: '-60%', 
              width: 'min(170%, 900px, 88vw)', 
              height: 'min(460px, 46vh)', 
              transform: 'translateX(-50%)', 
              pointerEvents: 'none', 
              zIndex: -1 
            }} 
            aria-hidden="true"
          >
            <LightRays
              raysOrigin="top-center"
              raysColor="#a78bfa" 
              raysSpeed={1.5}
              lightSpread={1.5}
              rayLength={1.5}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
            />
          </div>
          <ShimmerHeadline className="landing-shimmer" text="Hey, I’m Vignesh — wanna play a game?" />
        </div>
      </NeonReveal>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, 10%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        <Pyramid />
      </div>

      <div className="landing-actions">
        <GetStartedButton href="/games" />
      </div>
    </main>
  );
}
