
import { ProductForm } from '@/components/inventory/product-form';
import { PageHeader } from '@/components/page-header';
import { getProductById, getSuppliers } from '@/lib/data-service';
import type { Product, Supplier } from '@/types';
import { notFound } from 'next/navigation';

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
    <>
      <PageHeader title="Edit Product" description={`Update the details for ${product.name}.`} />
      <ProductForm product={product} suppliers={suppliers} />
    </>
  );
}
