"use client";

import { Button } from "@/components/ui/button";
import { useCurrency, type Currency } from "@/contexts/CurrencyContext";
import { DollarSign, Landmark } from "lucide-react"; // Using Landmark as a generic currency icon for SYP
import { useAppTranslation } from "@/hooks/useAppTranslation";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const { t } = useAppTranslation();

  const toggleCurrency = () => {
    setCurrency(currency === 'SYP' ? 'USD' : 'SYP');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleCurrency} aria-label={currency === 'SYP' ? "Switch to USD" : "Switch to SYP"}>
      {currency === 'SYP' ? <span className="font-semibold">ل.س</span> : <DollarSign className="h-5 w-5" />}
      <span className="sr-only">{currency === 'SYP' ? "Switch to USD" : "Switch to SYP"}</span>
    </Button>
  );
}
