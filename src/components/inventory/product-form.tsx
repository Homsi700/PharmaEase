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

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  barcode: z.string().min(1, "Barcode is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  supplierId: z.string().optional(),
  purchasePrice: z.coerce.number().min(0, "Purchase price must be non-negative"),
  sellingPrice: z.coerce.number().min(0, "Selling price must be non-negative"),
  unit: z.string().min(1, "Unit is required"),
  quantityInStock: z.coerce.number().int().min(0, "Quantity must be a non-negative integer"),
  expiryDate: z.date({ required_error: "Expiry date is required." }),
  lowStockThreshold: z.coerce.number().int().min(0, "Low stock threshold must be non-negative").optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  suppliers: Supplier[];
}

export function ProductForm({ product, suppliers }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
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
          unit: "unit",
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
      toast({ title: "Success", description: `Product ${product ? 'updated' : 'added'} successfully.` });
      router.push('/inventory');
      router.refresh(); // Ensures the product table is up-to-date
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };
  
  // Placeholder for barcode scanning logic
  const handleBarcodeScan = () => {
    // In a real app, this would trigger camera access and barcode scanning.
    // For now, we can simulate by prompting or using a demo value.
    const scannedBarcode = prompt("Enter or scan barcode:");
    if (scannedBarcode) {
      setValue("barcode", scannedBarcode);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <div className="flex gap-2">
                <Input id="barcode" {...register('barcode')} />
                <Button type="button" variant="outline" onClick={handleBarcodeScan} aria-label="Scan Barcode">
                  <ScanLine className="h-4 w-4" />
                </Button>
              </div>
              {errors.barcode && <p className="text-sm text-destructive">{errors.barcode.message}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category (Optional)</Label>
              <Input id="category" {...register('category')} />
            </div>
            <div>
              <Label htmlFor="supplierId">Supplier (Optional)</Label>
              <Select onValueChange={(value) => setValue('supplierId', value)} defaultValue={product?.supplierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
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
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input id="purchasePrice" type="number" step="0.01" {...register('purchasePrice')} />
              {errors.purchasePrice && <p className="text-sm text-destructive">{errors.purchasePrice.message}</p>}
            </div>
            <div>
              <Label htmlFor="sellingPrice">Selling Price</Label>
              <Input id="sellingPrice" type="number" step="0.01" {...register('sellingPrice')} />
              {errors.sellingPrice && <p className="text-sm text-destructive">{errors.sellingPrice.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit">Unit (e.g., box, strip)</Label>
              <Input id="unit" {...register('unit')} />
              {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
            </div>
            <div>
              <Label htmlFor="quantityInStock">Quantity In Stock</Label>
              <Input id="quantityInStock" type="number" {...register('quantityInStock')} />
              {errors.quantityInStock && <p className="text-sm text-destructive">{errors.quantityInStock.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
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
                    {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={(date) => date && setValue('expiryDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="lowStockThreshold">Low Stock Threshold (Optional)</Label>
              <Input id="lowStockThreshold" type="number" {...register('lowStockThreshold')} />
              {errors.lowStockThreshold && <p className="text-sm text-destructive">{errors.lowStockThreshold.message}</p>}
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit">{product ? 'Update Product' : 'Add Product'}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
