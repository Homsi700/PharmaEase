"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const toggleLanguage = () => {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label={locale === 'ar' ? "Switch to English" : "التبديل إلى العربية"}>
      <Globe className="h-5 w-5" />
      <span className="sr-only">{locale === 'ar' ? "Switch to English" : "التبديل إلى العربية"}</span>
    </Button>
  );
}
