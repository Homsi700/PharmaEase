
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

// TODO: Implement actual supplier data fetching and display
// import { getSuppliers } from '@/lib/data-service';
// import type { Supplier } from '@/types';
// import { SupplierTable } from '@/components/suppliers/supplier-table';


export default function SuppliersPage() {
  // const suppliers: Supplier[] = getSuppliers();

  return (
    <>
      <PageHeader title="Supplier Management" description="Manage your pharmacy suppliers.">
         <Link href="/suppliers/new" passHref>
          <Button disabled> {/* TODO: Enable when new supplier page is implemented */}
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </Link>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Suppliers List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Supplier management will be implemented here.</p>
          {/* <SupplierTable suppliers={suppliers} /> */}
           {/* Placeholder content */}
          <div className="mt-4 p-4 border rounded-md text-center">
            Supplier functionality is under development.
          </div>
        </CardContent>
      </Card>
    </>
  );
}
