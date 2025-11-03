"use client";
import { useEffect } from "react";
import type { SettingsState } from "@/lib/types/settings";

interface ThemeProviderProps {
  settings: SettingsState;
  children: React.ReactNode;
}

export function ThemeProvider({ settings, children }: ThemeProviderProps) {
  useEffect(() => {
    const root = window.document.documentElement;
    const themeMode = settings.interfaceConfig?.themeMode;

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    if (themeMode === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
    } else if (themeMode === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (mediaQuery.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    }
  }, [settings.interfaceConfig?.themeMode]);

  return <>{children}</>;
}
