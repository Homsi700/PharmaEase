
import { getProducts } from '@/lib/data-service';
import type { Product } from '@/types';
import { TranslationsWrapper } from '@/components/translations-wrapper';
import { InventoryPageContent } from './inventory-page-content';


export default function InventoryPage() {
  const products: Product[] = getProducts();

  return (
    <TranslationsWrapper>
      <InventoryPageContent products={products} />
    </TranslationsWrapper>
  );
}
