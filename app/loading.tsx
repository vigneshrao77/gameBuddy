import React from 'react';
import { Loading } from '@/components/ui/Loading';

export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loading />
      <p className="text-sm text-[var(--text-secondary)] font-medium tracking-wide">
        Loading...
      </p>
    </div>
  );
}
