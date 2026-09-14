"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';

export function Navbar() {
  const { theme, setTheme } = useTheme();

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
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle color theme"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/><circle cx="17" cy="7" r="1"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
