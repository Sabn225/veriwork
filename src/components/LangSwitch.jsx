'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';

// Moved out of Navbar.jsx unchanged so the app shell and auth screens can reuse it.
export default function LangSwitch() {
  const { language, changeLanguage, t, LANGUAGES } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (!e.target.closest('.lang-switch')) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="lang-switch">
      <button type="button" className="lang-btn" aria-label={t('nav.language')} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" /></svg>
        <span>{language.toUpperCase()}</span>
      </button>
      {open && (
        <ul className="lang-menu" role="listbox">
          {LANGUAGES.map((l) => (
            <li key={l.code} role="presentation">
              <button type="button" className="lang-option" role="option" aria-selected={language === l.code} onClick={() => { changeLanguage(l.code); setOpen(false); }}>
                {l.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
