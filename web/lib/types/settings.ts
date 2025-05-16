export type SearchEngine = "baidu" | "google" | "bing";
export type InterfaceMode = "navigation" | "homepage" | "starry" | "simplicity";
export type ThemeMode = "system" | "light" | "dark";
export type Language = "zh-CN" | "en";

export interface SettingsState {
  interfaceConfig: InterfaceConfig;
  moduleConfig: ModuleConfig;
  groupConfig: GroupCofnig;
  siteConfig: SiteConfig;
}

interface InterfaceConfig {
  interfaceMode: InterfaceMode;
  themeMode: ThemeMode;
  language: Language;
}

interface ModuleConfig {
  showMeteors?: boolean;
  showSearchBar: boolean;
  searchEngine: SearchEngine;
  showClock: boolean;
  showCalendar: boolean;
  calendarFormat: "YYYY-MM-DD" | "MM/DD/YYYY" | "DD.MM.YYYY" | "YYYY年MM月DD日";
}

interface GroupCofnig {
  groupLayout: "grid" | "row";
}

interface SiteConfig {
  siteTitle?: string;
  siteFooter?: string;
}
