'use client';
import { useEffect } from 'react';
import { useLanguage } from './LanguageContext';

// Client pages cannot export Next metadata, so set a translated document title here.
export function usePageTitle(key) {
  const { t, language } = useLanguage();
  useEffect(() => {
    document.title = `${t(key)} – VeriWork`;
    // t changes identity on every render; the language is what actually changes the text.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, language]);
}
