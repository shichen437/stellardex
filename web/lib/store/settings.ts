import { create } from "zustand";
import { SettingsState } from "../types/settings";
import { getSettings, updateSettings } from "@/api/settings";
import { SETTINGS_KEY } from "./consts";

interface SettingsStore {
  settings: SettingsState;
  getSettings: (refresh?: boolean) => Promise<SettingsState>;
  updateSettings: (data: SettingsState) => Promise<void>;
  clearSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: (() => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? (JSON.parse(data) as SettingsState) : ({} as SettingsState);
    } catch {
      return {} as SettingsState;
    }
  })(),
  async getSettings(refresh = false) {
    const { settings } = get();
    if (settings && !refresh) {
      return settings;
    }
    const res = await getSettings();
    if (res.code === 0) {
      const data = res.data;
      set({ settings: data });
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
      return data;
    }
    return {} as SettingsState;
  },
  async updateSettings(s: SettingsState) {
    await updateSettings(s);
    set({ settings: s });
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  },
  clearSettings() {
    set({ settings: {} as SettingsState });
    localStorage.removeItem(SETTINGS_KEY);
  },
}));
