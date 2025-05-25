
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react"; // Added import for React
import { Button } from "@/components/ui/button";
import {
  Activity,
  Moon,
  Sun,
  Globe,
  UserCircle2,
  Settings,
  LogOut,
  LayoutGrid,
  Menu as MenuIcon,
  Boxes,
  ScanBarcode,
  ShoppingCart,
  Users,
  LineChart,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
// Removed useTheme import as it's not directly used here, ThemeSwitcher handles its own context.

interface NavItem {
  href: string;
  labelKey: string;
  icon?: LucideIcon; 
}

const mainNavItems: NavItem[] = [
  { href: "/inventory", labelKey: "inventory", icon: Boxes }, 
  { href: "/quick-invoice", labelKey: "quickInvoiceBarcode", icon: ScanBarcode },
  { href: "/sales", labelKey: "sales", icon: ShoppingCart },
  { href: "/suppliers", labelKey: "suppliers", icon: Users },
  { href: "/reports", labelKey: "reports", icon: LineChart },
  { href: "/smart-order", labelKey: "smartOrder", icon: Wand2 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useAppTranslation();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/90"
              aria-label={t('pharmaEase')}
            >
              <Activity className="h-7 w-7" />
              <span className="hidden sm:inline">{t('pharmaEase')}</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-3 md:flex">
              {mainNavItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <CurrencySwitcher />
            <ThemeSwitcher />
            <LanguageSwitcher />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle2 className="h-6 w-6" />
                  <span className="sr-only">{t('userProfile')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0">
                <div className="flex h-full flex-col">
                  <div className="flex h-16 items-center border-b px-6">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-lg font-semibold text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Activity className="h-7 w-7" />
                      <span>{t('pharmaEase')}</span>
                    </Link>
                  </div>
                  <nav className="flex-1 space-y-2 p-4">
                    {mainNavItems.map((item) => (
                      <Link
                        href={item.href}
                        key={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent",
                          pathname === item.href && "bg-accent text-primary font-semibold"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        {t(item.labelKey)}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {t('pharmaEase')}. {t('allRightsReserved')}.
      </footer>
    </div>
  );
}
