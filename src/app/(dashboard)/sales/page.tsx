
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

// TODO: Implement actual sales data fetching and display
// import { getSales } from '@/lib/data-service';
// import type { Sale } from '@/types';
// import { SalesTable } from '@/components/sales/sales-table';

export default function SalesPage() {
  // const sales: Sale[] = getSales();

  return (
    <>
      <PageHeader title="Sales Management" description="Record new sales and view sales history.">
        <Link href="/sales/new" passHref>
          <Button disabled> {/* TODO: Enable when new sales page is implemented */}
            <PlusCircle className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </Link>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Sales recording and history display will be implemented here.</p>
          {/* <SalesTable sales={sales} /> */}
          {/* Placeholder content */}
          <div className="mt-4 p-4 border rounded-md text-center">
            Sales functionality is under development.
          </div>
        </CardContent>
      </Card>
    </>
  );
}
