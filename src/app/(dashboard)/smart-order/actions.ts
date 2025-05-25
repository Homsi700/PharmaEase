
"use server";

import { getProducts, getSales } from '@/lib/data-service';
import type { Product, Sale } from '@/types';

export interface SmartOrderPrefillData {
  products: Product[];
  sales: Sale[];
}

export async function getSmartOrderPrefillDataAction(): Promise<SmartOrderPrefillData> {
  const products = getProducts();
  const sales = getSales();
  return { products, sales };
}
