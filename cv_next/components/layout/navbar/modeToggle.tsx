"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { isBrowser } from "@/lib/utils";
import { useEffect } from "react";
import { ThemeManager } from "@/app/themeManager/themeManager";

export const themeManager = new ThemeManager('dark')

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  useEffect(()=> {
    themeManager.setTheme(theme === "light" ? "light" : "dark")
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme);
    themeManager.setTheme(newTheme)
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        if (isBrowser()) toggleTheme();
      }}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
