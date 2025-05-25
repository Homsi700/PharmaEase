
import { getSuppliers } from '@/lib/data-service';
import type { Supplier } from '@/types';
import { TranslationsWrapper } from '@/components/translations-wrapper';
import { NewProductPageContent } from './new-product-page-content';

export default function NewProductPage() {
  const suppliers: Supplier[] = getSuppliers();
  return (
    <TranslationsWrapper>
      <NewProductPageContent suppliers={suppliers} />
    </TranslationsWrapper>
  );
}
