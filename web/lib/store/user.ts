import { create } from "zustand";
import { login as apiLogin, logout as apiLogout, getInfo } from "@/api/user";
import { UserInfo } from "@/lib/types/user";
import { USER_KEY, LOGGED_KEY } from "./consts";
import {
  setToken,
  removeToken,
  setUsername,
  setIsLoggedIn,
  removeIsLoggedIn,
} from "./auth";
import { useSettingsStore } from "./settings";
import { useGroupStore } from "./group";

interface UserState {
  userInfo: UserInfo | null;
  getUserInfo: (refresh?: boolean) => Promise<UserInfo | null>;
  logout: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  userInfo: (() => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? (JSON.parse(data) as UserInfo) : null;
    } catch {
      return null;
    }
  })(),
  async getUserInfo(refresh = false) {
    const { userInfo } = get();
    if (!refresh && userInfo) {
      return userInfo;
    }
    const res = await getInfo();
    let info: UserInfo | null = null;
    if (res?.code === 0 && res.data) {
      info = res.data;
      set({ userInfo: info });
      localStorage.setItem(USER_KEY, JSON.stringify(info));
    } else {
      set({ userInfo: null });
      localStorage.removeItem(USER_KEY);
    }
    return info;
  },
  async login(username: string, password: string) {
    const res = await apiLogin(username, password);
    if (res?.code === 0) {
      setToken(res.data.token);
      setUsername(username);
      setIsLoggedIn(true);
      localStorage.setItem(LOGGED_KEY, "true");
      await get().getUserInfo(true);
      const getSettings = useSettingsStore.getState().getSettings;
      await getSettings(true);
    } else {
      throw new Error(res?.msg || "登录失败");
    }
  },
  async logout() {
    await apiLogout();
    get().clearUserInfo();
  },
  clearUserInfo() {
    set({ userInfo: null });
    removeIsLoggedIn();
    removeToken();
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LOGGED_KEY);
    useGroupStore.getState().clearGroups();
    useSettingsStore.getState().clearSettings();
  },
}));
