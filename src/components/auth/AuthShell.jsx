'use client';
import Link from 'next/link';
import { useLanguage } from '../../lib/LanguageContext';
import LangSwitch from '../LangSwitch';
import ThemeToggle from '../ThemeToggle';

// Frame for the four auth screens: logo, language and theme on top, the form centred, a quiet brand panel on wide screens.
export default function AuthShell({ children }) {
  const { t } = useLanguage();
  return (
    <div className="auth">
      <div className="auth-col">
        <a className="skip-link" href="#main">{t('nav.skip')}</a>
        <header className="auth-top">
          <Link href="/" className="logo">
            <img src="/logo-icon.png" alt="" className="logo-img" />
            <span>VeriWork</span>
          </Link>
          <div className="auth-tools">
            <LangSwitch />
            <ThemeToggle />
          </div>
        </header>
        <main id="main" className="auth-main" tabIndex={-1}>
          <div className="auth-card">{children}</div>
        </main>
      </div>
      <aside className="auth-panel on-dark" aria-hidden="true">
        <p className="auth-panel-title">{t('auth.panel')}</p>
        <p className="auth-panel-text">{t('hero.text')}</p>
      </aside>
    </div>
  );
}
