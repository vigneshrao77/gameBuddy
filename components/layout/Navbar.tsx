"use client";

import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';

export function Navbar() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <div className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5-8 5 8-5 8z"/></svg>
          </div>
          <Link href="/games" className="logo-word">GameHub</Link>
        </div>
        <nav className="links">
          <Link href="/games">Games</Link>
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
