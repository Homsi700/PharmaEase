"use server";

import { revalidatePath } from 'next/cache';
import { addProduct, updateProduct, deleteProduct, getProducts } from '@/lib/data-service';
import type { Product } from '@/types';
import { z } from 'zod';

// Zod schema for validation, matching the form
const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Product name is required"),
  barcode: z.string().min(1, "Barcode is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  supplierId: z.string().optional(),
  purchasePrice: z.number().min(0, "Purchase price must be non-negative"),
  sellingPrice: z.number().min(0, "Selling price must be non-negative"),
  unit: z.string().min(1, "Unit is required"),
  quantityInStock: z.number().int().min(0, "Quantity must be a non-negative integer"),
  expiryDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
  lowStockThreshold: z.number().int().min(0, "Low stock threshold must be non-negative").optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export async function addProductAction(productData: Product) {
  try {
    const validatedData = productSchema.parse(productData);
    addProduct(validatedData);
    revalidatePath('/inventory');
    return { success: true, message: 'Product added successfully.' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to add product.' };
  }
}

export async function updateProductAction(productData: Product) {
  try {
    const validatedData = productSchema.parse(productData);
    const result = updateProduct(validatedData);
    if (result) {
      revalidatePath('/inventory');
      revalidatePath(`/inventory/edit/${productData.id}`);
      return { success: true, message: 'Product updated successfully.' };
    }
    return { success: false, error: 'Product not found.' };
  } catch (error) {
     if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to update product.' };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    const success = deleteProduct(productId);
    if (success) {
      revalidatePath('/inventory');
      return { success: true, message: 'Product deleted successfully.' };
    }
    return { success: false, error: 'Failed to delete product or product not found.' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function getInventorySummaryAction() {
  const products = getProducts();
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.quantityInStock < (p.lowStockThreshold || 10)).length;
  const expiredCount = products.filter(p => new Date(p.expiryDate) < new Date()).length;
  return { totalProducts, lowStockCount, expiredCount };
}
