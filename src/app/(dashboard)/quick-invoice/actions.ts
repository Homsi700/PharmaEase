
"use server";

import { revalidatePath } from 'next/cache';
import { getProductByBarcode as getProductByBarcodeFromDb, addSale, addTransaction } from '@/lib/data-service';
import type { Product, Sale, SaleItem, Transaction } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const BarcodeSchema = z.string().min(1, "Barcode is required");

export async function getProductByBarcodeAction(barcode: string): Promise<Product | null> {
  try {
    BarcodeSchema.parse(barcode);
    const product = getProductByBarcodeFromDb(barcode);
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
): Promise<{ success: boolean; saleId?: string; invoiceNumber?: string; error?: string }> {
  try {
    const validatedData = CreateSaleSchema.parse({ items, totalAmount, paymentMethod });
    const currentDate = new Date().toISOString();
    const invoiceNum = `INV-${Date.now()}`;

    const newSale: Sale = {
      id: uuidv4(),
      saleDate: currentDate,
      items: validatedData.items,
      totalAmount: validatedData.totalAmount,
      paymentMethod: validatedData.paymentMethod,
      createdAt: currentDate,
      updatedAt: currentDate,
      invoiceNumber: invoiceNum 
    };

    const saleResult = addSale(newSale); // addSale in data-service handles stock update
    
    if (saleResult.id) {
      const transaction: Transaction = {
        id: uuidv4(),
        type: 'revenue',
        date: currentDate,
        amount: validatedData.totalAmount,
        description: `Sale from Quick Invoice - ${invoiceNum}`,
        relatedSaleId: saleResult.id,
        createdAt: currentDate,
        updatedAt: currentDate,
      };
      addTransaction(transaction);
    }
    
    revalidatePath('/sales');
    revalidatePath('/inventory'); 
    revalidatePath('/quick-invoice');
    revalidatePath('/reports'); // Reports might use transaction data

    return { success: true, saleId: saleResult.id, invoiceNumber: invoiceNum };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error("Error creating quick sale:", error);
    return { success: false, error: 'Failed to create sale.' };
  }
}

    