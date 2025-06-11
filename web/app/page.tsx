"use client";

import { useRouter } from "next/navigation";
import { Settings, LogOut, Library } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { SimpleModeView } from "@/components/modes/Simplicity";
import { NavigationModeView } from "@/components/modes/Navigation";
import { HomepageModeView } from "@/components/modes/Homepage";
import { StarryModeView } from "@/components/modes/Starry";
import type { SettingsState } from "@/lib/types/settings";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/lib/store/user";
import { setVersion } from "@/lib/store/version";
import { useSettingsStore } from "@/lib/store/settings";
import { checkVersion } from "@/api/settings";
import { CommonConfirmDialog } from "@/components/common/CommonConfirmDialog";
import { useIsMobile } from "@/hooks/useMobile";

function GlobalAuthListener() {
  useAuth();
  return null;
}

export default function Home() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { setLanguage, t } = usePolyglot();
  const [mounted, setMounted] = useState(false);
  const settings = useSettingsStore((state) => state.settings);
  const [showSettings, setShowSettings] = useState(false);
  const getSettings = useSettingsStore((state) => state.getSettings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const logoutStore = useUserStore((state) => state.logout);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  if (settings?.siteConfig?.siteTitle) {
    document.title = settings.siteConfig.siteTitle;
  }

  useEffect(() => {
    checkVersion().then((res) => {
      if (res?.code === 0 && res?.data?.latestVerison) {
        setVersion(res.data.latestVerison);
      }
    });
  }, []);

  useEffect(() => {
    if (settings.interfaceConfig?.language) {
      setLanguage(settings.interfaceConfig.language);
    }
  }, [settings.interfaceConfig?.language, setLanguage]);

  useEffect(() => {
    if (settings?.siteConfig?.siteTitle) {
      document.title = settings.siteConfig.siteTitle;
    } else {
      document.title = "Stellardex";
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

  if (!mounted) {
    return null;
  }

  return (
    <>
      <GlobalAuthListener />
      <div className="fixed top-4 right-4 z-50">
        {isMobile ? (
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-600 dark:text-red-500"
            onClick={() => setLogoutOpen(true)}
          >
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <>
            {settings?.moduleConfig?.showBookmarks && (
              <button
                onClick={() => router.push("/bookmark")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Library className="w-5.5 h-5.5" />
              </button>
            )}
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-5.5 h-5.5" />
            </button>
          </>
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

      <CommonConfirmDialog
        title={t("logout.title")}
        description={t("logout.message")}
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
      />
    </>
  );
}
