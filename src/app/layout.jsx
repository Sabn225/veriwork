import SiteChrome from '../components/SiteChrome';
import { LanguageProvider } from '../lib/LanguageContext';
import './globals.css';
import './ui.css';
import './layout.css';

// Runs before first paint: saved theme, else the OS preference. Also restores the saved language on <html>.
const themeScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem('veriwork-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t);var l=localStorage.getItem('veriwork-lang');if(l)d.setAttribute('lang',l)}catch(e){}})();`;

export const metadata = {
  title: 'VeriWork – Verified Experience. Real Value.',
  description: 'VeriWork gives students verifiable proof of real work experience to walk into any interview with confidence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
