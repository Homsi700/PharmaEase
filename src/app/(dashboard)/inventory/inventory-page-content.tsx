"use client";

import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ProductTable } from '@/components/inventory/product-table';
import type { Product } from '@/types';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface InventoryPageContentProps {
  products: Product[];
}

export function InventoryPageContent({ products }: InventoryPageContentProps) {
  const { t } = useAppTranslation();

  return (
    <>
      <PageHeader titleKey="inventoryManagement" descriptionKey="inventoryManagementDescription">
        <Link href="/inventory/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('addProduct')}
          </Button>
        </Link>
      </PageHeader>
      <ProductTable products={products} />
    </>
  );
}
