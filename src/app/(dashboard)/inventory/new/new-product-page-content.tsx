"use client";

import { PageHeader } from '@/components/page-header';
import { ProductForm } from '@/components/inventory/product-form';
import type { Supplier } from '@/types';

// No useAppTranslation needed directly here if PageHeader & ProductForm handle their own.

interface NewProductPageContentProps {
  suppliers: Supplier[];
}

export function NewProductPageContent({ suppliers }: NewProductPageContentProps) {
  return (
    <>
      <PageHeader titleKey="addNewProduct" descriptionKey="addNewProductDescription" />
      <ProductForm suppliers={suppliers} />
    </>
  );
}
