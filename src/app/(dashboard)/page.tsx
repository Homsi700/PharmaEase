
import { TranslationsWrapper } from '@/components/translations-wrapper';
import { DashboardPageContent } from './dashboard-page-content';

// This page is now the main dashboard screen.
// It will display the grid of icons/mini-apps.
export default function DashboardHomePage() {
  return (
    <TranslationsWrapper>
      <DashboardPageContent />
    </TranslationsWrapper>
  );
}
