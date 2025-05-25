
"use client";

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import {
  Boxes,
  ScanBarcode,
  ShoppingCart,
  Users,
  LineChart,
  Wand2,
  Search,
  LucideIcon,
} from 'lucide-react';

interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  descriptionKey: string;
}

const mainNavItems: NavItem[] = [
  { href: "/inventory", labelKey: "inventory", icon: Boxes, descriptionKey: "manageYourStock" },
  { href: "/quick-invoice", labelKey: "quickInvoiceBarcode", icon: ScanBarcode, descriptionKey: "fastBarcodeSales" },
  { href: "/sales", labelKey: "sales", icon: ShoppingCart, descriptionKey: "viewSalesHistory" },
  { href: "/suppliers", labelKey: "suppliers", icon: Users, descriptionKey: "manageSuppliers" },
  { href: "/reports", labelKey: "reports", icon: LineChart, descriptionKey: "viewReportsAnalytics" },
  { href: "/smart-order", labelKey: "smartOrder", icon: Wand2, descriptionKey: "aiStockSuggestions" },
];

export function DashboardPageContent() {
  const { t } = useAppTranslation();

  // Placeholder for username, replace with actual data if/when auth is implemented
  const userName = "PharmaEase User"; // Or t('pharmaEaseUser') for translation

  // Get current time to display appropriate greeting
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greetingKey = "goodEvening";
  if (currentHour < 12) {
    greetingKey = "goodMorning";
  } else if (currentHour < 18) {
    greetingKey = "goodAfternoon";
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t(greetingKey)}, {userName}!
        </h1>
        <p className="text-muted-foreground">{t('welcomeToPharmaEase')}</p>
      </div>

      {/* Central Search Bar - Aumel Inspired */}
      <div className="relative mx-auto w-full max-w-2xl">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('searchEverythingPlaceholder')}
          className="h-12 w-full rounded-lg bg-card pl-10 text-lg shadow-sm focus-visible:ring-primary"
        />
        {/* Search button can be added if needed, or search on type */}
      </div>

      {/* Main Navigation Grid - Aumel Inspired */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {mainNavItems.map((item) => (
          <Link href={item.href} key={item.href} passHref>
            <Card className="group flex h-full transform flex-col items-center justify-center p-6 text-center shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <item.icon className="mb-4 h-12 w-12 text-primary transition-colors duration-300 group-hover:text-primary/80" />
              <CardTitle className="mb-1 text-xl font-semibold text-foreground">
                {t(item.labelKey)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t(item.descriptionKey)}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
