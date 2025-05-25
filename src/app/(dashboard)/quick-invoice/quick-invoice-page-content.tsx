"use client";

import { PageHeader } from '@/components/page-header';
import { BarcodeScannerForm } from '@/components/quick-invoice/barcode-scanner-form';
// No useAppTranslation needed directly here if child components handle their own.

export function QuickInvoicePageContent() {
  return (
    <>
      <PageHeader titleKey="quickInvoicePageTitle" descriptionKey="quickInvoicePageDescription" />
      <BarcodeScannerForm />
    </>
  );
}
