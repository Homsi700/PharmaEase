
import { TranslationsWrapper } from '@/components/translations-wrapper';
import { SuppliersPageContent } from './suppliers-page-content';

// Data fetching (e.g., getSuppliers()) would happen here if needed
// and passed to SuppliersPageContent.

export default function SuppliersPage() {
  return (
    <TranslationsWrapper>
      <SuppliersPageContent />
    </TranslationsWrapper>
  );
}
