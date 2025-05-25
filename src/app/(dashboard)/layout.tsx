
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { useTheme } from "@/contexts/ThemeContext"; // To get current theme for icons

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useAppTranslation();
  const { theme } = useTheme(); // Get current theme for icon switching

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard" // Link to the new dashboard home
            className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/90"
            aria-label={t('pharmaEase')}
          >
            <Activity className="h-7 w-7" />
            <span>{t('pharmaEase')}</span>
          </Link>

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
                <DropdownMenuItem disabled> {/* Disabled as no auth */}
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled> {/* Disabled as no auth */}
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
