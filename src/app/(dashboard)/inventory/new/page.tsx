
import { ProductForm } from '@/components/inventory/product-form';
import { PageHeader } from '@/components/page-header';
import { getSuppliers } from '@/lib/data-service';
import type { Supplier } from '@/types';

export default function NewProductPage() {
  const suppliers: Supplier[] = getSuppliers();
  return (
    <>
      <PageHeader title="Add New Product" description="Fill in the details to add a new product to your inventory." />
      <ProductForm suppliers={suppliers} />
    </>
  );
}
