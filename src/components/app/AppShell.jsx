'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { APP_PREVIEW } from '../../lib/siteConfig';
import { signOut } from '../../lib/auth';
import LangSwitch from '../LangSwitch';
import ThemeToggle from '../ThemeToggle';
import { Avatar, Icon } from './Common';
import { useApp } from './AppState';

const NAV = [
  { href: '/dashboard', key: 'app.nav.dashboard', icon: 'dashboard' },
  { href: '/profile', key: 'app.nav.profile', icon: 'profile' },
  { href: '/projects', key: 'app.nav.projects', icon: 'projects' },
  { href: '/services', key: 'app.nav.services', icon: 'services' },
  { href: '/trust', key: 'app.nav.trust', icon: 'trust' },
  { href: '/settings', key: 'app.nav.settings', icon: 'settings' },
];

// Fixed top bar + sidebar + main area. Below 1024px the sidebar becomes a drawer opened from the top bar.
export default function AppShell({ children }) {
  const { t } = useLanguage();
  const { state } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = useRef(null);
  const userBtn = useRef(null);
  const userWrap = useRef(null);
  const sideRef = useRef(null);

  // Close both menus whenever the route changes.
  useEffect(() => { setNavOpen(false); setMenuOpen(false); }, [pathname]);

  // Drawer: Escape closes it and returns focus to the button that opened it; focus moves into it on open.
  useEffect(() => {
    if (!navOpen) return undefined;
    sideRef.current?.querySelector('a')?.focus();
    const onKey = (e) => { if (e.key === 'Escape') { setNavOpen(false); menuBtn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);

  // Account menu: outside click or Escape closes it.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => { if (!userWrap.current?.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') { setMenuOpen(false); userBtn.current?.focus(); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  const logout = async () => {
    try { await signOut(); } finally { router.push('/login'); }
  };

  const isCurrent = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="app">
      <a className="skip-link" href="#main">{t('nav.skip')}</a>

      <header className="app-top">
        <button type="button" ref={menuBtn} className="icon-btn app-menu-btn" aria-label={t('nav.menu')} aria-expanded={navOpen} aria-controls="app-side" onClick={() => setNavOpen(!navOpen)}>
          <Icon name="menu" />
        </button>
        <Link href="/dashboard" className="logo">
          <img src="/logo-icon.png" alt="" className="logo-img" />
          <span>VeriWork</span>
        </Link>

        <div className="app-top-right">
          <LangSwitch />
          <ThemeToggle />
          <div className="user-menu" ref={userWrap}>
            <button type="button" ref={userBtn} className="user-btn" aria-label={t('app.account')} aria-expanded={menuOpen} aria-controls="user-panel" onClick={() => setMenuOpen(!menuOpen)}>
              <Avatar name={state.user.name} src={state.photoUrl} size={32} />
              <span className="user-name">{state.user.name}</span>
              <Icon name="chevron" />
            </button>
            {menuOpen && (
              <div className="user-panel" id="user-panel">
                <div className="user-panel-id">
                  <p className="user-panel-name">{state.user.name}</p>
                  <p className="user-panel-mail">{state.user.email}</p>
                </div>
                <Link className="user-panel-item" href="/profile"><Icon name="profile" />{t('app.nav.profile')}</Link>
                <Link className="user-panel-item" href="/settings"><Icon name="settings" />{t('app.nav.settings')}</Link>
                <button type="button" className="user-panel-item" onClick={logout}><Icon name="logout" />{t('app.logout')}</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {APP_PREVIEW && (
        <aside className="app-preview" aria-label={t('common.sample')}>
          <span className="badge badge-neutral">{t('common.sample')}</span>
          <span>{t('app.preview')}</span>
        </aside>
      )}

      <div className="app-body">
        <nav className="app-side" id="app-side" aria-label={t('app.nav.aria')} ref={sideRef} data-open={navOpen}>
          <ul className="side-list">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link className="side-link" href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>
                  <Icon name={item.icon} />
                  <span>{t(item.key)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="side-foot">
            <Link className="side-link" href="/"><Icon name="back" /><span>{t('app.nav.website')}</span></Link>
          </div>
        </nav>
        <div className="app-scrim" data-open={navOpen} onClick={() => setNavOpen(false)} aria-hidden="true" />

        <main id="main" className="app-main" tabIndex={-1}>
          <div className="app-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
