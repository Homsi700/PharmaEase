
import { getProducts } from '@/lib/data-service';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { ProductTable } from '@/components/inventory/product-table';
import type { Product } from '@/types';

export default function InventoryPage() {
  const products: Product[] = getProducts();

  return (
    <>
      <PageHeader title="Inventory Management" description="View, add, and manage your pharmacy products.">
        <Link href="/inventory/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </PageHeader>
      
      <ProductTable products={products} />
    </>
  );
}
