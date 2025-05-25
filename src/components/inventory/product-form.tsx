"use client";

import type { Product, Supplier } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ScanLine } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { addProductAction, updateProductAction } from '@/app/(dashboard)/inventory/actions';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useCurrency } from '@/contexts/CurrencyContext';
import { arSA, enUS } from 'date-fns/locale'; // For calendar localization

interface ProductFormProps {
  product?: Product;
  suppliers: Supplier[];
}

export function ProductForm({ product, suppliers }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { t, locale } = useAppTranslation();
  const { currency } = useCurrency(); // only to potentially display currency symbols if needed, actual value is SYP

  const productSchema = z.object({
    name: z.string().min(1, t("productNameRequired")),
    barcode: z.string().min(1, t("barcodeRequired")),
    description: z.string().optional(),
    category: z.string().optional(),
    supplierId: z.string().optional(),
    purchasePrice: z.coerce.number().min(0, t("purchasePriceNonNegative")),
    sellingPrice: z.coerce.number().min(0, t("sellingPriceNonNegative")),
    unit: z.string().min(1, t("unitRequired")),
    quantityInStock: z.coerce.number().int().min(0, t("quantityNonNegativeInteger")),
    expiryDate: z.date({ required_error: t("expiryDateRequired") }),
    lowStockThreshold: z.coerce.number().int().min(0, t("lowStockThresholdNonNegative")).optional(),
  });
  
  type ProductFormData = z.infer<typeof productSchema>;

  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product 
      ? {
          ...product,
          purchasePrice: product.purchasePrice || 0,
          sellingPrice: product.sellingPrice || 0,
          quantityInStock: product.quantityInStock || 0,
          expiryDate: product.expiryDate ? new Date(product.expiryDate) : new Date(),
          lowStockThreshold: product.lowStockThreshold || 10,
        }
      : {
          purchasePrice: 0,
          sellingPrice: 0,
          quantityInStock: 0,
          unit: "unit", // Default or make it translatable if needed
          expiryDate: new Date(),
          lowStockThreshold: 10,
        },
  });

  const expiryDate = watch("expiryDate");

  const onSubmit = async (data: ProductFormData) => {
    const productData = {
      ...data,
      id: product?.id || uuidv4(),
      expiryDate: data.expiryDate.toISOString(),
      // Prices are always stored in SYP
      purchasePrice: data.purchasePrice,
      sellingPrice: data.sellingPrice,
      createdAt: product?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let result;
    if (product) {
      result = await updateProductAction(productData);
    } else {
      result = await addProductAction(productData);
    }

    if (result.success) {
      toast({ title: t("success"), description: t(product ? 'productUpdatedSuccessfully' : 'productAddedSuccessfully') });
      router.push('/inventory');
      router.refresh(); 
    } else {
      toast({ variant: "destructive", title: t("error"), description: result.error });
    }
  };
  
  const handleBarcodeScan = () => {
    const scannedBarcode = prompt(t("scanBarcode")); // Simple prompt, replace with actual scanner
    if (scannedBarcode) {
      setValue("barcode", scannedBarcode);
    }
  };
  
  const calendarLocale = locale === 'ar' ? arSA : enUS;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? t('editProduct') : t('addNewProduct')}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('productName')}</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="barcode">{t('barcode')}</Label>
              <div className="flex gap-2">
                <Input id="barcode" {...register('barcode')} />
                <Button type="button" variant="outline" onClick={handleBarcodeScan} aria-label={t('scanBarcode')}>
                  <ScanLine className="h-4 w-4" />
                </Button>
              </div>
              {errors.barcode && <p className="text-sm text-destructive">{errors.barcode.message}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">{t('descriptionOptional')}</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{t('categoryOptional')}</Label>
              <Input id="category" {...register('category')} />
            </div>
            <div>
              <Label htmlFor="supplierId">{t('supplierOptional')}</Label>
              <Select onValueChange={(value) => setValue('supplierId', value)} defaultValue={product?.supplierId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectASupplier')} />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchasePrice">{t('purchasePrice')} ({currency})</Label>
              <Input id="purchasePrice" type="number" step="0.01" {...register('purchasePrice')} />
              {errors.purchasePrice && <p className="text-sm text-destructive">{errors.purchasePrice.message}</p>}
            </div>
            <div>
              <Label htmlFor="sellingPrice">{t('sellingPrice')} ({currency})</Label>
              <Input id="sellingPrice" type="number" step="0.01" {...register('sellingPrice')} />
              {errors.sellingPrice && <p className="text-sm text-destructive">{errors.sellingPrice.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit">{t('unitEgBox')}</Label>
              <Input id="unit" {...register('unit')} />
              {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
            </div>
            <div>
              <Label htmlFor="quantityInStock">{t('quantityInStock')}</Label>
              <Input id="quantityInStock" type="number" {...register('quantityInStock')} />
              {errors.quantityInStock && <p className="text-sm text-destructive">{errors.quantityInStock.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">{t('expiryDate')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP", { locale: calendarLocale }) : <span>{t('pickADate')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={(date) => date && setValue('expiryDate', date)}
                    initialFocus
                    locale={calendarLocale}
                  />
                </PopoverContent>
              </Popover>
              {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="lowStockThreshold">{t('lowStockThresholdOptional')}</Label>
              <Input id="lowStockThreshold" type="number" {...register('lowStockThreshold')} />
              {errors.lowStockThreshold && <p className="text-sm text-destructive">{errors.lowStockThreshold.message}</p>}
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>{t('cancel')}</Button>
          <Button type="submit">{product ? t('updateProduct') : t('addProduct')}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
