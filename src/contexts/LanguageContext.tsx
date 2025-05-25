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
    // Set initial lang/dir based on state after checking localStorage
    // This ensures the document element is updated once the initial locale is determined
    document.documentElement.lang = storedLocale || 'ar';
    document.documentElement.dir = (storedLocale || 'ar') === 'ar' ? 'rtl' : 'ltr';
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
