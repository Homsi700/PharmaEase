
import { getProductById, getSuppliers } from '@/lib/data-service';
import type { Product, Supplier } from '@/types';
import { notFound } from 'next/navigation';
import { TranslationsWrapper } from '@/components/translations-wrapper';
import { EditProductPageContent } from './edit-product-page-content';

interface EditProductPageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const product = getProductById(params.id);
  const suppliers: Supplier[] = getSuppliers();

  if (!product) {
    notFound();
  }

  return (
    <TranslationsWrapper>
      <EditProductPageContent product={product} suppliers={suppliers} />
    </TranslationsWrapper>
  );
}
