// src/app/login/page.tsx
import type { Metadata } from 'next';
import { TranslationsWrapper } from '@/components/translations-wrapper';
import { LoginPageContent } from './login-page-content';

export const metadata: Metadata = {
  title: 'Login | PharmaEase',
  description: 'Login to PharmaEase',
};

export default function LoginPage() {
  return (
    <TranslationsWrapper>
      <LoginPageContent />
    </TranslationsWrapper>
  );
}
