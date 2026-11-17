'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LangSwitch from './LangSwitch';
import { NavMenu, CategoriesPanel, LinksPanel } from './MegaMenu';
import { CATEGORIES, browseHref } from '../lib/categories';

// Only links that lead somewhere real. Home is a plain link; "Find projects" opens the categories menu;
// "Why VeriWork" groups the three explainer sections of the home page.
const WHY = [
  { href: '/#how-it-works', key: 'nav.howItWorks', desc: 'menu.why.how', section: 'how-it-works' },
  { href: '/#credential', key: 'nav.credential', desc: 'menu.why.credential', section: 'credential' },
  { href: '/#trust', key: 'nav.trustSystem', desc: 'menu.why.trust', section: 'trust' },
];

// Every home-page section the scrollspy watches, in page order. Sections without a nav item simply clear the highlight.
const SPY_IDS = ['hero', 'features', 'how-it-works', 'credential', 'projects', 'trust', 'community', 'cta'];

function useActiveSection(enabled) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') { setActive(null); return; }
    const els = SPY_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const visible = new Set();
    // A thin band just above the middle of the viewport decides which section is "current".
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
      setActive(SPY_IDS.find((id) => visible.has(id)) || null);
    }, { rootMargin: '-40% 0px -55% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);

  return active;
}

export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);      // desktop dropdown: 'projects' | 'why' | null
  const [group, setGroup] = useState(null);            // mobile accordion group
  const active = useActiveSection(pathname === '/');

  // With an id: close that menu only if it is the one open. Without: close whichever is open.
  const closeMenus = useCallback((id) => setOpenMenu((cur) => (typeof id === 'string' && cur !== id ? cur : null)), []);
  const toggleMenu = useCallback((id, forceOpen) => setOpenMenu((cur) => (forceOpen ? id : cur === id ? null : id)), []);
  const closeAll = () => { setOpenMenu(null); setMenuOpen(false); };

  // Any page change closes every menu.
  useEffect(() => { setOpenMenu(null); setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const homeCurrent = active === 'hero' ? 'page' : undefined;
  const whyCurrent = WHY.some((w) => w.section === active) ? 'location' : undefined;
  const projectsCurrent = pathname.startsWith('/browse') ? 'page' : undefined;
  const whyItemCurrent = (item) => (active === item.section ? 'location' : undefined);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">{t('nav.skip')}</a>
      <div className="container header-inner">
        <Link href="/" className="logo">
          <img src="/logo-icon.png" alt="" className="logo-img" />
          <span>VeriWork</span>
        </Link>

        <nav className="main-nav" aria-label="Primary">
          <ul className="nav-list">
            <li className="nav-item">
              <Link className="nav-link" href="/" aria-current={homeCurrent}>{t('nav.home')}</Link>
            </li>
            <NavMenu id="projects" label={t('nav.findProjects')} open={openMenu === 'projects'} onToggle={toggleMenu} onClose={closeMenus} current={projectsCurrent}>
              <CategoriesPanel onNavigate={closeMenus} />
            </NavMenu>
            <NavMenu id="why" label={t('nav.why')} variant="drop" open={openMenu === 'why'} onToggle={toggleMenu} onClose={closeMenus} current={whyCurrent}>
              <LinksPanel items={WHY} onNavigate={closeMenus} />
            </NavMenu>
          </ul>
        </nav>

        <div className="header-right">
          <LangSwitch />
          <ThemeToggle />
          <Link className="btn btn-ghost btn-sm header-auth" href="/login">{t('auth.login')}</Link>
          <Link className="btn btn-primary btn-sm header-auth" href="/signup">{t('auth.signup')}</Link>
          <button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? t('nav.close') : t('nav.menu')}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="mobile-menu">
          <nav aria-label="Mobile">
            <ul>
              <li><Link className="mobile-nav-link" href="/" aria-current={homeCurrent} onClick={closeAll}>{t('nav.home')}</Link></li>

              <li>
                <button type="button" className="mobile-nav-link mobile-group-btn" aria-expanded={group === 'projects'} aria-controls="mobile-group-projects" onClick={() => setGroup(group === 'projects' ? null : 'projects')}>
                  {t('nav.findProjects')}
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <ul id="mobile-group-projects" className="mobile-sub" hidden={group !== 'projects'}>
                  <li><Link className="mobile-sub-link" href="/browse" onClick={closeAll}>{t('menu.seeAll')}</Link></li>
                  {CATEGORIES.map((c) => (
                    <li key={c.key}><Link className="mobile-sub-link" href={browseHref({ category: c.key })} onClick={closeAll}>{t(`cat.${c.key}`)}</Link></li>
                  ))}
                </ul>
              </li>

              <li>
                <button type="button" className="mobile-nav-link mobile-group-btn" aria-expanded={group === 'why'} aria-controls="mobile-group-why" aria-current={whyCurrent} onClick={() => setGroup(group === 'why' ? null : 'why')}>
                  {t('nav.why')}
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <ul id="mobile-group-why" className="mobile-sub" hidden={group !== 'why'}>
                  {WHY.map((item) => (
                    <li key={item.key}><Link className="mobile-sub-link" href={item.href} aria-current={whyItemCurrent(item)} onClick={closeAll}>{t(item.key)}</Link></li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          <div className="mobile-actions">
            <Link className="btn btn-ghost" href="/login" onClick={closeAll}>{t('auth.login')}</Link>
            <Link className="btn btn-primary" href="/signup" onClick={closeAll}>{t('auth.signup')}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
