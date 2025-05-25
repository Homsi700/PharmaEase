import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PharmaEase | صيدليتي',
  description: 'Modern Pharmacy Management System | نظام إدارة صيدلية حديث',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initial lang and dir are set here for SSR.
  // LanguageProvider's useEffect will update these on the client-side based on stored preferences or user interaction.
  return (
    <html lang="ar" dir="rtl">
      <body className={cn(geistSans.variable, geistMono.variable, "font-sans")}>
        <LanguageProvider>
          <ThemeProvider>
            <CurrencyProvider>
              {children}
              <Toaster />
            </CurrencyProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
