"use client";
// This hook is a convenience wrapper around useLanguage for easier access to `t` function.
import { useLanguage } from '@/contexts/LanguageContext';

export function useAppTranslation() {
  const { t, locale, setLocale } = useLanguage();
  return { t, locale, setLocale };
}
