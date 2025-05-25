"use server";

import { revalidatePath } from 'next/cache';
import { getProductByBarcode as getProductByBarcodeFromDb, addSale } from '@/lib/data-service';
import type { Product, Sale, SaleItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const BarcodeSchema = z.string().min(1, "Barcode is required");

export async function getProductByBarcodeAction(barcode: string): Promise<Product | null> {
  try {
    BarcodeSchema.parse(barcode);
    const product = getProductByBarcodeFromDb(barcode); // Assuming data-service has this
    return product || null;
  } catch (error) {
    console.error("Error fetching product by barcode:", error);
    return null;
  }
}

const SaleItemSchema = z.object({
  productId: z.string(),
  quantitySold: z.number().int().min(1),
  sellingPriceAtSale: z.number().min(0),
});

const CreateSaleSchema = z.object({
  items: z.array(SaleItemSchema).min(1, "At least one item is required for a sale."),
  totalAmount: z.number().min(0),
  paymentMethod: z.string().min(1, "Payment method is required."),
});

export async function createQuickSaleAction(
  items: SaleItem[],
  totalAmount: number,
  paymentMethod: string
): Promise<{ success: boolean; saleId?: string; error?: string }> {
  try {
    const validatedData = CreateSaleSchema.parse({ items, totalAmount, paymentMethod });

    const newSale: Sale = {
      id: uuidv4(),
      saleDate: new Date().toISOString(),
      items: validatedData.items,
      totalAmount: validatedData.totalAmount,
      paymentMethod: validatedData.paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now()}` // Simple invoice number
    };

    const saleResult = addSale(newSale); // addSale in data-service handles stock update
    
    revalidatePath('/sales');
    revalidatePath('/inventory'); // Revalidate inventory due to stock changes
    revalidatePath('/quick-invoice');

    return { success: true, saleId: saleResult.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error("Error creating quick sale:", error);
    return { success: false, error: 'Failed to create sale.' };
  }
}
