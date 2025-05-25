"use client";

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Boxes } from 'lucide-react'; 
import { useAppTranslation } from '@/hooks/useAppTranslation';

export function ReportsPageContent() {
  const { t } = useAppTranslation();
  return (
    <>
      <PageHeader titleKey="reportsAndAnalytics" descriptionKey="reportsAndAnalyticsDescription" />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalRevenue')}</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div> {/* TODO: Localize currency */}
            <p className="text-xs text-muted-foreground">
              {t('dataNotAvailable')}
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('salesThisMonth')}</CardTitle>
             <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
               {t('dataNotAvailable')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('lowStockItems')}</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">
               {t('dataNotAvailable')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>{t('salesTrends')}</CardTitle>
            <CardDescription>{t('salesTrendsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            {/* <SalesChart /> Placeholder */}
            {t('salesChartPlaceholder')}
          </CardContent>
        </Card>
      </div>
       <div className="mt-6 grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>{t('stockOverview')}</CardTitle>
            <CardDescription>{t('stockOverviewDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            {/* <StockChart /> Placeholder */}
            {t('stockChartPlaceholder')}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
