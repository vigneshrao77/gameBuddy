import Link from 'next/link';

export function Footer() {
  return (
    <footer className="wrap foot">
      <div className="foot-brand">
        <span className="foot-word">GameHub</span>
        <p>Open the site and start playing. No sign-in, no setup.</p>
      </div>
      <div className="foot-links">
        <Link href="/games">Games</Link>
        <Link href="/">Home</Link>
      </div>
    </footer>
  );
}
