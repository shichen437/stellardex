import { useEffect } from 'react';
import type { SettingsState } from '@/lib/types/settings';

interface ThemeProviderProps {
  settings: SettingsState;
  children: React.ReactNode;
}

export function ThemeProvider({ settings, children }: ThemeProviderProps) {
  useEffect(() => {
    const root = window.document.documentElement;
    const themeMode = settings.interfaceConfig?.themeMode;

    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.interfaceConfig?.themeMode]);

  return <>{children}</>;
}