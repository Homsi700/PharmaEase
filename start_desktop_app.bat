@echo off
echo Starting PharmaEase Desktop App...
echo.
echo This will start both the Next.js server and Electron app.
echo Please wait for the application to start...
echo.

REM Start Next.js and Electron
npm run desktop-start
pause
  products: Product[];
}

export function InventoryPageContent({ products }: InventoryPageContentProps) {
  const { t } = useAppTranslation();

  return (
    <div className="space-y-6">
      <PageHeader titleKey="inventoryManagement" descriptionKey="inventoryManagementDescription">
        <Link href="/inventory/new" passHref>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('addProduct')}
          </Button>
        </Link>
      </PageHeader>
      <ProductTable products={products} />
    </div>
  );
}