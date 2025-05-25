"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";


export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useAppTranslation();

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}>
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      <span className="sr-only">{theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}</span>
    </Button>
  );
}
