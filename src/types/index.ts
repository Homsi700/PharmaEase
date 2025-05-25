
export type Product = {
  id: string; // UUID
  name: string;
  barcode: string; // Unique barcode text
  description?: string;
  category?: string;
  supplierId?: string; // Link to suppliers.json
  purchasePrice: number;
  sellingPrice: number;
  unit: string; // e.g., box, strip, tablet
  quantityInStock: number;
  expiryDate: string; // ISO date string or other date format
  lowStockThreshold?: number; // Optional: threshold for low stock alerts
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type SaleItem = {
  productId: string; // Link to products.json
  quantitySold: number;
  sellingPriceAtSale: number;
};

export type Sale = {
  id: string; // UUID
  customerId?: string; // Optional, link to customers.json
  saleDate: string; // ISO date string
  totalAmount: number;
  items: SaleItem[];
  paymentMethod: string; // e.g., cash, card
  invoiceNumber?: string; // Optional
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type Customer = {
  id: string; // UUID
  name: string;
  phoneNumber?: string;
  address?: string;
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type Supplier = {
  id: string; // UUID
  name: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type TransactionType = 'revenue' | 'expense';

export type Transaction = {
  id: string; // UUID
  type: TransactionType;
  date: string; // ISO date string
  amount: number;
  description: string;
  relatedSaleId?: string; // Optional, link to sales.json for revenue
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
