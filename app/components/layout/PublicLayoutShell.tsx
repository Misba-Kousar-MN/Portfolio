'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Cursor } from './Cursor';

/**
 * PublicLayoutShell
 *
 * Client component that conditionally renders the public Navbar + Footer
 * only for non-admin routes. Using usePathname() (client-side) is 100%
 * reliable -- avoids the race condition with server-side header detection.
 */
export function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  if (isAdminRoute) {
    return (
      <>
        {children}
        <Cursor />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative z-10">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Cursor />
    </div>
  );
}
