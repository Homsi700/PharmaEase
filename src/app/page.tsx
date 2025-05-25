
import { TranslationsWrapper } from '@/components/translations-wrapper';
import { LoginPageContent } from '@/app/login/login-page-content'; // Import LoginPageContent

export default function RootPage() {
  // Directly render the login page content at the root
  return (
    <TranslationsWrapper>
      <LoginPageContent />
    </TranslationsWrapper>
  );
}
