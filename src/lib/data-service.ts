// @ts-nocheck
// TODO: Remove @ts-nocheck and fix type errors
// For POC, fs operations are simplified. In a real app, use async file operations and proper error handling.
import fs from 'fs';
import path from 'path';
import type { Product, Sale, Customer, Supplier, Transaction } from '@/types';

const dataDir = path.join(process.cwd(), 'src', 'data');

const productsFilePath = path.join(dataDir, 'products.json');
const salesFilePath = path.join(dataDir, 'sales.json');
const customersFilePath = path.join(dataDir, 'customers.json');
const suppliersFilePath = path.join(dataDir, 'suppliers.json');
const transactionsFilePath = path.join(dataDir, 'transactions.json');

function ensureFileExists(filePath: string) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), 'utf-8');
  }
}

ensureFileExists(productsFilePath);
ensureFileExists(salesFilePath);
ensureFileExists(customersFilePath);
ensureFileExists(suppliersFilePath);
ensureFileExists(transactionsFilePath);

// Generic read function
function readData<T>(filePath: string): T[] {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData) as T[];
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    return [];
  }
}

// Generic write function
function writeData<T>(filePath: string, data: T[]): void {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf-8');
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
  }
}

// Product functions
export const getProducts = (): Product[] => readData<Product>(productsFilePath);
export const addProduct = (product: Product): Product => {
  const products = getProducts();
  products.push(product);
  writeData<Product>(productsFilePath, products);
  return product;
};
export const updateProduct = (updatedProduct: Product): Product | null => {
  let products = getProducts();
  const index = products.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = updatedProduct;
    writeData<Product>(productsFilePath, products);
    return updatedProduct;
  }
  return null;
};
export const deleteProduct = (productId: string): boolean => {
  let products = getProducts();
  const initialLength = products.length;
  products = products.filter(p => p.id !== productId);
  if (products.length < initialLength) {
    writeData<Product>(productsFilePath, products);
    return true;
  }
  return false;
};
export const getProductById = (productId: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === productId);
};
export const getProductByBarcode = (barcode: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.barcode === barcode);
};


// Sales functions
export const getSales = (): Sale[] => readData<Sale>(salesFilePath);
export const addSale = (sale: Sale): Sale => {
  const sales = getSales();
  sales.push(sale);
  writeData<Sale>(salesFilePath, sales);
  // Update stock levels
  sale.items.forEach(item => {
    const product = getProductById(item.productId);
    if (product) {
      const newQuantity = product.quantityInStock - item.quantitySold;
      updateProduct({ ...product, quantityInStock: newQuantity >= 0 ? newQuantity : 0 });
    }
  });
  return sale;
};

// Customer functions
export const getCustomers = (): Customer[] => readData<Customer>(customersFilePath);
export const addCustomer = (customer: Customer): Customer => {
  const customers = getCustomers();
  customers.push(customer);
  writeData<Customer>(customersFilePath, customers);
  return customer;
};

// Supplier functions
export const getSuppliers = (): Supplier[] => readData<Supplier>(suppliersFilePath);
export const addSupplier = (supplier: Supplier): Supplier => {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  writeData<Supplier>(suppliersFilePath, suppliers);
  return supplier;
};
export const updateSupplier = (updatedSupplier: Supplier): Supplier | null => {
  let suppliers = getSuppliers();
  const index = suppliers.findIndex(s => s.id === updatedSupplier.id);
  if (index !== -1) {
    suppliers[index] = updatedSupplier;
    writeData<Supplier>(suppliersFilePath, suppliers);
    return updatedSupplier;
  }
  return null;
};
export const deleteSupplier = (supplierId: string): boolean => {
  let suppliers = getSuppliers();
  const initialLength = suppliers.length;
  suppliers = suppliers.filter(s => s.id !== supplierId);
  if (suppliers.length < initialLength) {
    writeData<Supplier>(suppliersFilePath, suppliers);
    return true;
  }
  return false;
};


// Transaction functions
export const getTransactions = (): Transaction[] => readData<Transaction>(transactionsFilePath);
export const addTransaction = (transaction: Transaction): Transaction => {
  const transactions = getTransactions();
  transactions.push(transaction);
  writeData<Transaction>(transactionsFilePath, transactions);
  return transaction;
};
