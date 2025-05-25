"use client";

import type { ReactNode } from 'react';

// This component is simplified. If its original purpose was to ensure translation context
// is ready or to fix hydration issues by establishing a client boundary,
// this minimal form should still serve that. LanguageProvider is at the root,
// so client components within can use useAppTranslation directly.

interface TranslationsWrapperProps {
  children: ReactNode;
  // translationKeys prop removed as it's no longer used for injecting 't' via render prop
}

export function TranslationsWrapper({ children }: TranslationsWrapperProps) {
  return <>{children}</>;
}
