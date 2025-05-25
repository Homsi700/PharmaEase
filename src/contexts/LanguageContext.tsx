"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '@/translations/en.json';
import arTranslations from '@/translations/ar.json';

type Locale = 'en' | 'ar';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  en: enTranslations,
  ar: arTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar'); // Default to Arabic

  useEffect(() => {
    const storedLocale = localStorage.getItem('pharmaease-locale') as Locale | null;
    if (storedLocale) {
      setLocaleState(storedLocale);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pharmaease-locale', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = (key: string, replacements: Record<string, string> = {}): string => {
    let translation = translations[locale]?.[key] || translations['en']?.[key] || key; // Fallback to English then key
    Object.keys(replacements).forEach(placeholder => {
      translation = translation.replace(`{{${placeholder}}}`, replacements[placeholder]);
    });
    return translation;
  };
  
  // Special case for the RootLayout where html tag needs to be rendered by the provider itself
  if (typeof window === 'undefined') { // Server-side rendering
    return (
        <html lang="ar" dir="rtl">
          <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
          </LanguageContext.Provider>
        </html>
    );
  }
  
  // Client-side: directly return children wrapped in provider after useEffect sets lang/dir
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
