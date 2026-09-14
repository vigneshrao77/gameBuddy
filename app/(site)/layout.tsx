import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

/**
 * Chrome for the app itself. The landing page at "/" sits outside this group,
 * so it renders without the navbar and footer.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="wrap">{children}</main>
      <Footer />
    </>
  );
}
