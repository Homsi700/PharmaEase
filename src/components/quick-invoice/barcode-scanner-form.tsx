"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScanLine, PlusCircle, Trash2, CameraOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getProductByBarcodeAction, createQuickSaleAction } from '@/app/(dashboard)/quick-invoice/actions';
import type { Product, SaleItem } from '@/types';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ScannedItem extends SaleItem {
  name: string;
  totalPrice: number;
}

export function BarcodeScannerForm() {
  const { t } = useAppTranslation();
  const { toast } = useToast();
  const { formatPrice, currency: currentDisplayCurrency } = useCurrency(); // Prices are handled in SYP backend

  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  // In a real app, you'd integrate a barcode scanning library here.
  // For this prototype, we'll simulate scanning or rely on manual input.

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          // To stop the camera stream when component unmounts or permission is revoked:
          return () => {
            stream.getTracks().forEach(track => track.stop());
          };
        } catch (error) {
          console.error(t('errorAccessingCamera'), error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: t('cameraAccessDenied'),
            description: t('enableCameraPermissions'),
          });
        }
      } else {
        setHasCameraPermission(false); // No camera API support
         toast({
            variant: 'destructive',
            title: t('cameraAccessDenied'),
            description: "Camera not available or not supported by your browser.",
          });
      }
    };

    // getCameraPermission(); // Uncomment to activate camera on load. For now, let user click a button.
  }, [t, toast]);
  
  const activateScanner = async () => {
     if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error(t('errorAccessingCamera'), error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: t('cameraAccessDenied'),
            description: t('enableCameraPermissions'),
          });
        }
      } else {
         setHasCameraPermission(false);
      }
  };

  const handleBarcodeScannedOrEntered = async (barcode: string) => {
    if (!barcode) return;
    setIsLoading(true);
    const product = await getProductByBarcodeAction(barcode);
    setIsLoading(false);
    setBarcodeInput('');

    if (product) {
      const existingItemIndex = scannedItems.findIndex(item => item.productId === product.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...scannedItems];
        updatedItems[existingItemIndex].quantitySold += 1;
        updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantitySold * product.sellingPrice;
        setScannedItems(updatedItems);
      } else {
        setScannedItems(prevItems => [
          ...prevItems,
          {
            productId: product.id,
            name: product.name,
            quantitySold: 1,
            sellingPriceAtSale: product.sellingPrice, // Price in SYP
            totalPrice: product.sellingPrice, // Price in SYP
          },
        ]);
      }
      toast({ title: t('success'), description: t('productAddedToInvoice') });
    } else {
      toast({ variant: 'destructive', title: t('error'), description: t('noProductFoundWithBarcode') });
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setScannedItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantitySold: newQuantity, totalPrice: newQuantity * item.sellingPriceAtSale }
          : item
      ).filter(item => item.quantitySold > 0) // Remove if quantity is 0 or less
    );
  };

  const removeItem = (productId: string) => {
    setScannedItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const calculateTotalAmount = () => {
    return scannedItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleCompleteSale = async () => {
    if (scannedItems.length === 0) {
      toast({ variant: 'destructive', title: t('error'), description: t('addItem') + ' ' + t('failedToCompleteSale')});
      return;
    }
    setIsLoading(true);
    const saleItems: SaleItem[] = scannedItems.map(item => ({
      productId: item.productId,
      quantitySold: item.quantitySold,
      sellingPriceAtSale: item.sellingPriceAtSale, // SYP
    }));
    const totalAmount = calculateTotalAmount(); // SYP

    const result = await createQuickSaleAction(saleItems, totalAmount, paymentMethod);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: t('saleCompleted'),
        description: `${t('invoiceNumber')}: ${result.saleId}`,
      });
      setScannedItems([]);
      setPaymentMethod('cash');
    } else {
      toast({ variant: 'destructive', title: t('error'), description: result.error || t('failedToCompleteSale') });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t('scanProductBarcode')}</CardTitle>
          <CardDescription>
            {t('quickInvoicePageDescription')} {hasCameraPermission === false && t('cameraAccessDenied')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <Label htmlFor="barcode-input">{t('barcode')}</Label>
              <Input
                id="barcode-input"
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBarcodeScannedOrEntered(barcodeInput)}
                placeholder={t('barcode')}
                disabled={isLoading}
              />
            </div>
            <Button onClick={() => handleBarcodeScannedOrEntered(barcodeInput)} disabled={isLoading || !barcodeInput}>
              <PlusCircle className="mr-2 h-4 w-4" /> {t('addItem')}
            </Button>
          </div>

          {/* Camera View and Controls */}
          <div className="space-y-2">
            <Button onClick={activateScanner} variant="outline" disabled={hasCameraPermission === true}>
              <ScanLine className="mr-2 h-4 w-4" /> {t('scanBarcode')} ( {t('activateScanner')} )
            </Button>
            {hasCameraPermission === null && <p className="text-sm text-muted-foreground">Click button to activate camera for scanning.</p>}
            <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
              {hasCameraPermission ? (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  <CameraOff className="mx-auto h-12 w-12" />
                  <p>{t('cameraAccessRequired')}</p>
                  {hasCameraPermission === false && <p className="text-xs">{t('allowCameraAccess')}</p>}
                </div>
              )}
            </div>
             {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTitle>{t('cameraAccessDenied')}</AlertTitle>
                  <AlertDescription>{t('enableCameraPermissions')}</AlertDescription>
                </Alert>
              )}
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
          <CardTitle>{t('invoiceSummary') || 'Invoice Summary'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="payment-method">{t('paymentMethod')}</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder={t('paymentMethod')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">{t('cash')}</SelectItem>
                <SelectItem value="card">{t('card')}</SelectItem>
                {/* Add other payment methods as needed */}
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

// Helper component for client-side only rendering, to avoid hydration issues with camera
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <>{children}</>;
}
