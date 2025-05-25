
import { TranslationsWrapper } from '@/components/translations-wrapper';
import { SalesPageContent } from './sales-page-content';

// Data fetching (e.g., getSales()) would happen here if needed by SalesPageContent
// and then passed as props. For now, SalesPageContent doesn't fetch data.

export default function SalesPage() {
  return (
    <TranslationsWrapper>
      <SalesPageContent />
    </TranslationsWrapper>
  );
}
