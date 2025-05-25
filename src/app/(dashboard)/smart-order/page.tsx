
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { generateSuggestedOrder, type GenerateSuggestedOrderInput, type GenerateSuggestedOrderOutput } from '@/ai/flows/ai-driven-stock-ordering';
import { useToast } from "@/hooks/use-toast";
import { getSmartOrderPrefillDataAction, type SmartOrderPrefillData } from './actions'; // Updated import
import { useAppTranslation } from '@/hooks/useAppTranslation';

const getCurrentDate = () => new Date().toISOString().split('T')[0];

const exampleSalesData = JSON.stringify([
  { productId: "example-id-1", quantitySold: 10, dateOfSale: getCurrentDate() },
  { productId: "example-id-2", quantitySold: 5, dateOfSale: getCurrentDate() }
], null, 2);

const exampleStockLevels = JSON.stringify([
  { productId: "example-id-1", quantityInStock: 50 },
  { productId: "example-id-2", quantityInStock: 20 }
], null, 2);

const exampleExpirationDates = JSON.stringify([
  { productId: "example-id-1", expirationDate: "2025-12-31" },
  { productId: "example-id-2", expirationDate: "2024-08-15" }
], null, 2);


export default function SmartOrderPage() {
  const { t } = useAppTranslation();
  const [salesData, setSalesData] = useState('');
  const [stockLevels, setStockLevels] = useState('');
  const [expirationDates, setExpirationDates] = useState('');
  const [suggestedOrder, setSuggestedOrder] = useState<GenerateSuggestedOrderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrefilling, setIsPrefilling] = useState(false);
  const { toast } = useToast();

  const handlePrefillData = async () => {
    setIsPrefilling(true);
    try {
      const { products: currentProducts, sales: currentSales } = await getSmartOrderPrefillDataAction();

      const stock = currentProducts.map(p => ({ productId: p.id, name: p.name, quantityInStock: p.quantityInStock }));
      const expirations = currentProducts.map(p => ({ productId: p.id, name: p.name, expiryDate: p.expiryDate }));
      
      const sales = currentSales.flatMap(s => s.items.map(item => ({
        productId: item.productId,
        quantitySold: item.quantitySold,
        dateOfSale: new Date(s.saleDate).toISOString().split('T')[0]
      })));
      
      setSalesData(sales.length > 0 ? JSON.stringify(sales, null, 2) : exampleSalesData);
      setStockLevels(stock.length > 0 ? JSON.stringify(stock, null, 2) : exampleStockLevels);
      setExpirationDates(expirations.length > 0 ? JSON.stringify(expirations, null, 2) : exampleExpirationDates);

      toast({ title: t("dataPrefilled"), description: t("dataPrefilledDescription") });
    } catch (error) {
      console.error("Error prefilling data:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ variant: "destructive", title: t("error"), description: t("errorPrefillingData", {errorMessage}) });
    } finally {
      setIsPrefilling(false);
    }
  };


  const handleSubmit = async () => {
    if (!salesData || !stockLevels || !expirationDates) {
      toast({ variant: "destructive", title: t("missingData"), description: t("missingDataDescription") });
      return;
    }

    setIsLoading(true);
    setSuggestedOrder(null);

    try {
      const input: GenerateSuggestedOrderInput = {
        salesData,
        stockLevels,
        expirationDates,
      };
      const result = await generateSuggestedOrder(input);
      setSuggestedOrder(result);
      toast({ title: t("suggestionGenerated"), description: t("suggestionGeneratedDescription") });
    } catch (error) {
      console.error("Error generating suggested order:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ variant: "destructive", title: t("error"), description: t("errorGeneratingSuggestion", {errorMessage}) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader titleKey="aiStockOrdering" descriptionKey="aiStockOrderingDescription" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('inputData')}</CardTitle>
            <CardDescription>{t('inputDataDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button onClick={handlePrefillData} variant="outline" size="sm" className="mb-2" disabled={isPrefilling}>
                {isPrefilling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('prefillData')}
              </Button>
            </div>
            <div>
              <Label htmlFor="salesData">{t('salesDataJson')}</Label>
              <Textarea 
                id="salesData" 
                value={salesData} 
                onChange={(e) => setSalesData(e.target.value)} 
                rows={6}
                placeholder={exampleSalesData}
                disabled={isLoading || isPrefilling}
              />
            </div>
            <div>
              <Label htmlFor="stockLevels">{t('stockLevelsJson')}</Label>
              <Textarea 
                id="stockLevels" 
                value={stockLevels} 
                onChange={(e) => setStockLevels(e.target.value)} 
                rows={6}
                placeholder={exampleStockLevels}
                disabled={isLoading || isPrefilling}
              />
            </div>
            <div>
              <Label htmlFor="expirationDates">{t('expirationDatesJson')}</Label>
              <Textarea 
                id="expirationDates" 
                value={expirationDates} 
                onChange={(e) => setExpirationDates(e.target.value)} 
                rows={6}
                placeholder={exampleExpirationDates}
                disabled={isLoading || isPrefilling}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading || isPrefilling} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {t('generateSuggestion')}
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:sticky lg:top-6 self-start">
          <CardHeader>
            <CardTitle>{t('suggestedOrder')}</CardTitle>
            <CardDescription>{t('suggestedOrderDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">{t('generatingSuggestion')}</p>
              </div>
            )}
            {suggestedOrder && !isLoading && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t('suggestedOrderItems')}</h3>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    {JSON.stringify(JSON.parse(suggestedOrder.suggestedOrder), null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t('reasoning')}</h3>
                  <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{suggestedOrder.reasoning}</p>
                </div>
              </div>
            )}
            {!suggestedOrder && !isLoading && (
              <p className="text-muted-foreground text-center py-10">
                {t('enterDataPrompt')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
