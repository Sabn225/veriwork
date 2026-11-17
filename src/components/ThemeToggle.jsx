'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';

const read = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

export default function ThemeToggle() {
  const { t } = useLanguage();
  const [theme, setTheme] = useState('light');

  // layout.jsx already set data-theme before paint; mirror it into state and keep following it, because the
  // Appearance tab in Settings can change the theme while this toggle is on screen.
  useEffect(() => {
    setTheme(read());
    const mo = new MutationObserver(() => setTheme(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  const toggle = () => {
    const next = read() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('veriwork-theme', next); } catch (e) { /* storage unavailable */ }
  };

  return (
    <button type="button" className="icon-btn" aria-label={t('nav.theme')} aria-pressed={theme === 'dark'} onClick={toggle}>
      <svg className="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
      <svg className="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
    </button>
  );
}
