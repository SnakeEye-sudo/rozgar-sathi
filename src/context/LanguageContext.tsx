import React, { createContext, useContext, useState } from 'react';

type Lang = 'hi' | 'en';

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (en: string, hi: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('rozgar-lang') as Lang) || 'hi';
  });

  const toggleLang = () => {
    const next = lang === 'hi' ? 'en' : 'hi';
    setLang(next);
    localStorage.setItem('rozgar-lang', next);
  };

  const t = (en: string, hi: string) => lang === 'hi' ? hi : en;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
