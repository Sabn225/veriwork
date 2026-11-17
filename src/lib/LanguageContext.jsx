'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, LANGUAGES } from './dictionary';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Kiểm tra xem lần trước người dùng chọn tiếng gì
    const savedLang = localStorage.getItem('veriwork-lang') || 'en';
    setLanguage(savedLang);
    document.documentElement.lang = savedLang;
  }, []);

  const changeLanguage = (code) => {
    setLanguage(code);
    localStorage.setItem('veriwork-lang', code);
    document.documentElement.lang = code;
  };

  // Hàm t() dùng để dịch. Nó sẽ tìm key, nếu không có thì lấy tiếng Anh, nếu vẫn không có thì in ra chính cái key đó.
  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);