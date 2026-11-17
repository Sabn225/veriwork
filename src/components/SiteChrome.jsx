'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { BARE_ROUTES } from '../lib/siteConfig';

// The marketing navbar and footer appear on public pages only. The app workspace and the auth screens bring their own layout.
// Any other route (including ones that already exist in your project) keeps the marketing chrome.
export default function SiteChrome({ children }) {
  const pathname = usePathname() || '/';
  const bare = BARE_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  if (bare) return children;
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
