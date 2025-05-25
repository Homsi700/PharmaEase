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
import { getProducts, getSales } from '@/lib/data-service'; // For pre-filling data

// Helper to get current date in YYYY-MM-DD format
const getCurrentDate = () => new Date().toISOString().split('T')[0];

// Example structure for pre-filling, adapt as needed
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
  const [salesData, setSalesData] = useState('');
  const [stockLevels, setStockLevels] = useState('');
  const [expirationDates, setExpirationDates] = useState('');
  const [suggestedOrder, setSuggestedOrder] = useState<GenerateSuggestedOrderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePrefillData = () => {
    const currentProducts = getProducts();
    const currentSales = getSales();

    const stock = currentProducts.map(p => ({ productId: p.id, name: p.name, quantityInStock: p.quantityInStock }));
    const expirations = currentProducts.map(p => ({ productId: p.id, name: p.name, expiryDate: p.expiryDate }));
    
    // Basic sales transformation - needs more robust aggregation for real use
    const sales = currentSales.flatMap(s => s.items.map(item => ({
      productId: item.productId,
      quantitySold: item.quantitySold,
      dateOfSale: new Date(s.saleDate).toISOString().split('T')[0]
    })));
    
    setSalesData(sales.length > 0 ? JSON.stringify(sales, null, 2) : exampleSalesData);
    setStockLevels(stock.length > 0 ? JSON.stringify(stock, null, 2) : exampleStockLevels);
    setExpirationDates(expirations.length > 0 ? JSON.stringify(expirations, null, 2) : exampleExpirationDates);

    toast({ title: "Data Prefilled", description: "Input fields have been prefilled with current data / examples." });
  };


  const handleSubmit = async () => {
    if (!salesData || !stockLevels || !expirationDates) {
      toast({ variant: "destructive", title: "Missing Data", description: "Please provide all required data." });
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
      toast({ title: "Suggestion Generated", description: "AI has generated a new stock order suggestion." });
    } catch (error) {
      console.error("Error generating suggested order:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ variant: "destructive", title: "Error", description: `Failed to generate suggestion: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="AI-Driven Stock Ordering" description="Leverage AI to get smart suggestions for your next stock order." />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
            <CardDescription>Provide sales, stock, and expiration data in JSON format.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button onClick={handlePrefillData} variant="outline" size="sm" className="mb-2">
                Prefill with Current Data / Examples
              </Button>
            </div>
            <div>
              <Label htmlFor="salesData">Sales Data (JSON)</Label>
              <Textarea 
                id="salesData" 
                value={salesData} 
                onChange={(e) => setSalesData(e.target.value)} 
                rows={6}
                placeholder={exampleSalesData}
              />
            </div>
            <div>
              <Label htmlFor="stockLevels">Current Stock Levels (JSON)</Label>
              <Textarea 
                id="stockLevels" 
                value={stockLevels} 
                onChange={(e) => setStockLevels(e.target.value)} 
                rows={6}
                placeholder={exampleStockLevels}
              />
            </div>
            <div>
              <Label htmlFor="expirationDates">Expiration Dates (JSON)</Label>
              <Textarea 
                id="expirationDates" 
                value={expirationDates} 
                onChange={(e) => setExpirationDates(e.target.value)} 
                rows={6}
                placeholder={exampleExpirationDates}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Suggestion
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:sticky lg:top-6 self-start">
          <CardHeader>
            <CardTitle>Suggested Order</CardTitle>
            <CardDescription>AI-generated stock order suggestion based on your input.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Generating suggestion...</p>
              </div>
            )}
            {suggestedOrder && !isLoading && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Suggested Order Items:</h3>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    {JSON.stringify(JSON.parse(suggestedOrder.suggestedOrder), null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Reasoning:</h3>
                  <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{suggestedOrder.reasoning}</p>
                </div>
              </div>
            )}
            {!suggestedOrder && !isLoading && (
              <p className="text-muted-foreground text-center py-10">
                Enter data and click "Generate Suggestion" to see results here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
