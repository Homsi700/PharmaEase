"use client";

import { PageHeader } from '@/components/page-header';
import { ProductForm } from '@/components/inventory/product-form';
import type { Product, Supplier } from '@/types';

// No useAppTranslation needed directly here if PageHeader & ProductForm handle their own translations
// and no top-level translated text is rendered by this component itself.

interface EditProductPageContentProps {
  product: Product;
  suppliers: Supplier[];
}

export function EditProductPageContent({ product, suppliers }: EditProductPageContentProps) {
  return (
    <>
      <PageHeader 
        titleKey="editProduct" 
        descriptionKey="editProductDescription"
        descriptionValues={{ productName: product.name }}
      />
      <ProductForm product={product} suppliers={suppliers} />
    </>
  );
}
