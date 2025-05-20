"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Settings, LogOut } from "lucide-react";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { SimpleModeView } from "@/components/modes/Simplicity";
import { NavigationModeView } from "@/components/modes/Navigation";
import { HomepageModeView } from "@/components/modes/Homepage";
import { StarryModeView } from "@/components/modes/Starry";
import type { SettingsState } from "@/lib/types/settings";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { useAuth } from "@/hooks/useAuth";
import { useSettingsStore } from "@/lib/store/settings";
import { useUserStore } from "@/lib/store/user";
import { useIsMobile } from "@/hooks/useMobile";
import { LogoutModal } from "@/components/settings/modal/LogoutModal";

export default function Home() {
  useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const settings = useSettingsStore((state) => state.settings);
  const getSettings = useSettingsStore((state) => state.getSettings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const { setLanguage } = usePolyglot();
  const isMobile = useIsMobile();
  const logoutStore = useUserStore((state) => state.logout);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  if (settings?.siteConfig?.siteTitle) {
    document.title = settings.siteConfig.siteTitle;
  }

  useEffect(() => {
    if (settings.interfaceConfig?.language) {
      setLanguage(settings.interfaceConfig.language);
    }
  }, [settings.interfaceConfig?.language, setLanguage]);

  useEffect(() => {
    if (settings?.siteConfig?.siteTitle) {
      document.title = settings.siteConfig.siteTitle;
    }
  }, [settings?.siteConfig?.siteTitle]);

  const handleSettingsChange = useCallback(
    (newSettings: SettingsState) => {
      updateSettings(newSettings);
    },
    [updateSettings]
  );

  const handleLogout = async () => {
    try {
      await logoutStore();
    } catch (e) {
      console.error(e);
    } finally {
      router.push("/login");
    }
  };

  const renderContent = useCallback(() => {
    if (!settings) return null;
    switch (settings.interfaceConfig?.interfaceMode) {
      case "simplicity":
        return <SimpleModeView />;
      case "homepage":
        return <HomepageModeView />;
      case "starry":
        return <StarryModeView />;
      default:
        return <NavigationModeView />;
    }
  }, [settings]);

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {isMobile ? (
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-600 dark:text-red-500"
            onClick={() => setLogoutOpen(true)}
          >
            <LogOut className="w-6 h-6" />
          </button>
        ) : (
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-6 h-6" />
          </button>
        )}
      </div>

      {showSettings && settings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}

      {settings && (
        <ThemeProvider settings={settings}>{renderContent()}</ThemeProvider>
      )}

      <LogoutModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
      />
    </>
  );
}
