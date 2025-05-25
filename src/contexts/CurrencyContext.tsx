"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'SYP' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Placeholder exchange rate - in a real app, fetch this from an API
const EXCHANGE_RATES: Record<Currency, number> = {
  SYP: 1,
  USD: 0.00007, // Example: 1 SYP = 0.00007 USD (adjust as needed for SYP as base)
};
const SYP_USD_RATE = 1 / EXCHANGE_RATES.USD; // Approx 14000 SYP for 1 USD

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('SYP'); // Default to SYP

  useEffect(() => {
    const storedCurrency = localStorage.getItem('pharmaease-currency') as Currency | null;
    if (storedCurrency) {
      setCurrencyState(storedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    localStorage.setItem('pharmaease-currency', newCurrency);
    setCurrencyState(newCurrency);
  };

  const formatPrice = (priceInSYP: number): string => {
    if (currency === 'USD') {
      const priceInUSD = priceInSYP / SYP_USD_RATE;
      return priceInUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    // Default to SYP
    return priceInSYP.toLocaleString('ar-SY', { style: 'currency', currency: 'SYP' });
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
