
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Activity,
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Users,
  LineChart,
  Wand2,
  Settings,
  ScanBarcode, // Added ScanBarcode
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";

interface NavItem {
  href: string;
  labelKey: string; // Changed to use translation key
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/inventory", labelKey: "inventory", icon: Boxes },
  { href: "/quick-invoice", labelKey: "quickInvoiceBarcode", icon: ScanBarcode }, // Added Quick Invoice
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
  const { t, locale } = useAppTranslation();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold">{t('pharmaEase')}</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                    tooltip={{ children: t(item.labelKey), side: locale === 'ar' ? "left" : "right", align: "center" }}
                  >
                    <a>
                      <item.icon />
                      <span>{t(item.labelKey)}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        {/* Optional Footer
        <SidebarFooter className="p-4">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            {t('settings')}
          </Button>
        </SidebarFooter> */}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:h-16 sm:px-6">
          <div className="flex-1">
            <SidebarTrigger className="md:hidden" />
          </div>
           <Link href="/" className="flex items-center gap-2 md:hidden">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-semibold">{t('pharmaEase')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <CurrencySwitcher />
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
