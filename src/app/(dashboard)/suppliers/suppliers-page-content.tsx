"use client";

import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { useAppTranslation } from '@/hooks/useAppTranslation';

// TODO: Implement actual supplier data fetching and display
// import { getSuppliers } from '@/lib/data-service';
// import type { Supplier } from '@/types';
// import { SupplierTable } from '@/components/suppliers/supplier-table';

export function SuppliersPageContent() {
  const { t } = useAppTranslation();
  // const suppliers: Supplier[] = getSuppliers(); // Would be passed as prop

  return (
    <>
      <PageHeader titleKey="supplierManagement" descriptionKey="supplierManagementDescription">
        <Link href="/suppliers/new" passHref>
          <Button disabled> {/* TODO: Enable when new supplier page is implemented */}
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('addSupplier')}
          </Button>
        </Link>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('suppliersList')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('supplierNotImplemented')}</p>
          {/* <SupplierTable suppliers={suppliers} /> */}
          {/* Placeholder content */}
          <div className="mt-4 p-4 border rounded-md text-center">
            {t('supplierUnderDevelopment')}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
