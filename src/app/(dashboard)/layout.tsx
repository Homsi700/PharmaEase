
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Boxes,
  ShoppingCart,
  Users,
  LineChart,
  Wand2,
  ScanBarcode,
  Menu as MenuIcon,
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
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
}

// Root page / redirects to /inventory, so /inventory is the main "dashboard"
const navItems: NavItem[] = [
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
  const pathname = usePathname();
  const { t } = useAppTranslation();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between">
          {/* Left side: Logo and Desktop Nav */}
          <div className="flex items-center gap-4">
            <Link
              href="/inventory" // Default to inventory page
              className="flex items-center gap-2 font-semibold"
              aria-label={t('pharmaEase')}
            >
              <Activity className="h-6 w-6 text-primary" />
              <span className="hidden sm:inline-block">{t('pharmaEase')}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    (pathname === item.href || (item.href !== "/inventory" && pathname.startsWith(item.href)) || (item.href === "/inventory" && pathname === "/"))
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side: Switchers and Mobile Menu Trigger */}
          <div className="flex items-center gap-2">
            <CurrencySwitcher />
            <ThemeSwitcher />
            <LanguageSwitcher />

            {/* Mobile Navigation Trigger */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label={t('settings')}>
                    <MenuIcon className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{t('pharmaEase')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2 w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.labelKey)}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        {children}
      </main>
    </div>
  );
}
