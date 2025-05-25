
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getProductByBarcodeAction, createQuickSaleAction } from '@/app/(dashboard)/quick-invoice/actions';
import type { Product, SaleItem } from '@/types';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ScannedItem extends SaleItem {
  name: string;
  totalPrice: number;
  expiryDate?: string; // Optional: for highlighting
  barcode?: string; // For potential future use or reference
}

export function BarcodeScannerForm() {
  const { t } = useAppTranslation();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  const [manualBarcodeInput, setManualBarcodeInput] = useState('');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);
  
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Focus the hidden input on mount and after certain actions
  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

  const resetAndFocusHiddenInput = useCallback(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = '';
      hiddenInputRef.current.focus();
    }
  }, []);

  const handleBarcodeScannedOrEntered = useCallback(async (barcode: string) => {
    if (!barcode.trim()) return;
    setIsLoading(true);
    
    // Try to find the product by barcode
    const product = await getProductByBarcodeAction(barcode.trim());
    
    setIsLoading(false);
    setManualBarcodeInput(''); // Clear manual input field
    resetAndFocusHiddenInput(); // Clear and re-focus hidden input

    if (product) {
      if (product.quantityInStock <= 0) {
        toast({ variant: 'destructive', title: t('error'), description: t('productOutOfStock', { productName: product.name }) });
        return;
      }

      const existingItemIndex = scannedItems.findIndex(item => item.productId === product.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...scannedItems];
        if (updatedItems[existingItemIndex].quantitySold < product.quantityInStock) {
          updatedItems[existingItemIndex].quantitySold += 1;
          updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantitySold * product.sellingPrice;
          setScannedItems(updatedItems);
          toast({ title: t('success'), description: t('productQuantityIncreased', { productName: product.name }) });
        } else {
          toast({ variant: 'destructive', title: t('error'), description: t('maxStockReached', { productName: product.name }) });
        }
      } else {
        setScannedItems(prevItems => [
          ...prevItems,
          {
            productId: product.id,
            name: product.name,
            quantitySold: 1,
            sellingPriceAtSale: product.sellingPrice,
            totalPrice: product.sellingPrice,
            expiryDate: product.expiryDate,
            barcode: product.barcode,
          },
        ]);
        toast({ title: t('success'), description: t('productAddedToInvoice', { productName: product.name }) });
      }
    } else {
      toast({ variant: 'destructive', title: t('error'), description: t('productNotFound') });
    }
  }, [scannedItems, toast, t, resetAndFocusHiddenInput]);

  const handleHiddenInputKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const barcodeValue = event.currentTarget.value;
      if (barcodeValue.trim()) {
        handleBarcodeScannedOrEntered(barcodeValue.trim());
      }
    }
  }, [handleBarcodeScannedOrEntered]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    const itemToUpdate = scannedItems.find(item => item.productId === productId);
    const productDetails = getProductByBarcodeAction(itemToUpdate?.barcode || ''); // Need original product details for stock check
    
    Promise.resolve(productDetails).then(originalProduct => {
      if (originalProduct && newQuantity > originalProduct.quantityInStock) {
        toast({ variant: 'destructive', title: t('error'), description: t('maxStockReached', { productName: originalProduct.name }) });
        // Optionally revert to max available quantity or previous quantity
        // For now, we'll just show the error. The user can manually adjust.
        setScannedItems(prevItems =>
          prevItems.map(item =>
            item.productId === productId
              ? { ...item, quantitySold: originalProduct.quantityInStock, totalPrice: originalProduct.quantityInStock * item.sellingPriceAtSale }
              : item
          )
        );
        return;
      }

      setScannedItems(prevItems =>
        prevItems.map(item =>
          item.productId === productId
            ? { ...item, quantitySold: Math.max(1, newQuantity), totalPrice: Math.max(1, newQuantity) * item.sellingPriceAtSale } // Ensure quantity is at least 1
            : item
        )
      );
    });
  };

  const removeItem = (productId: string) => {
    setScannedItems(prevItems => prevItems.filter(item => item.productId !== productId));
    resetAndFocusHiddenInput();
  };

  const calculateTotalAmount = () => {
    return scannedItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleCompleteSale = async () => {
    if (scannedItems.length === 0) {
      toast({ variant: 'destructive', title: t('error'), description: t('addItem') + ' ' + t('failedToCompleteSale')});
      resetAndFocusHiddenInput();
      return;
    }
    setIsLoading(true);
    const saleItems: SaleItem[] = scannedItems.map(item => ({
      productId: item.productId,
      quantitySold: item.quantitySold,
      sellingPriceAtSale: item.sellingPriceAtSale,
    }));
    const totalAmount = calculateTotalAmount();

    const result = await createQuickSaleAction(saleItems, totalAmount, paymentMethod);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: t('saleCompleted'),
        description: `${t('invoiceNumber')}: ${result.invoiceNumber}`,
      });
      setScannedItems([]);
      setPaymentMethod('cash');
      setManualBarcodeInput('');
    } else {
      toast({ variant: 'destructive', title: t('error'), description: result.error || t('failedToCompleteSale') });
    }
    resetAndFocusHiddenInput();
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    try {
      return new Date(expiryDate) < new Date();
    } catch (e) { return false; }
  };

  const isSoonToExpire = (expiryDate?: string, days: number = 30): boolean => {
    if (!expiryDate) return false;
    try {
      const exp = new Date(expiryDate);
      const today = new Date();
      today.setHours(0,0,0,0); // Compare dates only
      const soonDate = new Date(today);
      soonDate.setDate(soonDate.getDate() + days);
      return exp < soonDate && exp >= today;
    } catch (e) { return false; }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t('quickInvoicePageTitle')}</CardTitle>
          <CardDescription>
            {t('quickInvoiceExternalScannerDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hidden input for external barcode scanner */}
          <input
            ref={hiddenInputRef}
            type="text"
            onKeyDown={handleHiddenInputKeyDown}
            aria-label={t('barcodeScannerInput')}
            className="opacity-0 w-0 h-0 absolute -top-full -left-full" // Visually hide but keep focusable
            tabIndex={-1} // Keep it out of normal tab flow
          />

          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <Label htmlFor="manual-barcode-input">{t('manualBarcodeEntry')}</Label>
              <Input
                id="manual-barcode-input"
                type="text"
                value={manualBarcodeInput}
                onChange={(e) => setManualBarcodeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleBarcodeScannedOrEntered(manualBarcodeInput);
                  }
                }}
                placeholder={t('barcodeInputPlaceholder')}
                disabled={isLoading}
              />
            </div>
            <Button onClick={() => handleBarcodeScannedOrEntered(manualBarcodeInput)} disabled={isLoading || !manualBarcodeInput}>
              <PlusCircle className="mr-2 h-4 w-4" /> {t('addItem')}
            </Button>
          </div>
          
          {scannedItems.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">{t('items')}</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('productName')}</TableHead>
                      <TableHead className="w-[100px] text-center">{t('quantity')}</TableHead>
                      <TableHead className="text-right">{t('price')}</TableHead>
                      <TableHead className="text-right">{t('total')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scannedItems.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            value={item.quantitySold}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                            className="w-16 text-center mx-auto h-8"
                            min="1"
                          />
                        </TableCell>
                        <TableCell className="text-right">{formatPrice(item.sellingPriceAtSale)}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.totalPrice)}</TableCell>
                        <TableCell>
                          {isExpired(item.expiryDate) ? (
                            <Badge variant="destructive">{t('expired')}</Badge>
                          ) : isSoonToExpire(item.expiryDate) ? (
                            <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 text-white">{t('soonToExpire')}</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">{t('ok')}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:sticky lg:top-6 self-start">
        <CardHeader>
          <CardTitle>{t('invoiceSummary')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="payment-method">{t('paymentMethod')}</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} onOpenChange={() => hiddenInputRef.current?.focus()}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder={t('paymentMethod')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">{t('cash')}</SelectItem>
                <SelectItem value="card">{t('card')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-2xl font-bold">
            <span>{t('totalAmount')}: </span>
            <span>{formatPrice(calculateTotalAmount())}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleCompleteSale} disabled={isLoading || scannedItems.length === 0}>
            {isLoading ? (t('loading') || 'Loading...') : t('completeSale')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    