/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSettingsStore } from "@/lib/store/settings";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { type NavItem } from "@/lib/types/notification";
import { getNavItems } from "@/lib/consts/notification-nav";
import { ChannelsView } from "@/components/notifications/views/ChannelsView";
import { NotificationsView } from "@/components/notifications/views/NotificationsView";

function GlobalAuthListener() {
  useAuth();
  return null;
}
export default function NotifactionPage() {
  const { t } = usePolyglot();
  const router = useRouter();
  const settings = useSettingsStore((state) => state.settings);
  const getSettings = useSettingsStore((state) => state.getSettings);
  const [navItemsState, setNavItemsState] = useState<NavItem[]>(() =>
    getNavItems(t)
  );
  const [currentStatus, setCurrentStatus] = useState<number | undefined>(
    undefined
  );
  const [currentGroup, setCurrentGroup] = useState<string | undefined>(
    "status"
  );
  const [selectedTab, setSelectedTab] = useState<"notification" | "channel">(
    "notification"
  );

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  useEffect(() => {
    setNavItemsState((prev) =>
      prev.map((item) => ({
        ...item,
        label: t(item.labelKey),
      }))
    );
  }, [t]);

  useEffect(() => {
    if (settings?.siteConfig?.siteTitle) {
      document.title =
        settings.siteConfig.siteTitle + " | " + t("notification.title");
    } else {
      document.title = t("notification.title");
    }
  }, [settings?.siteConfig?.siteTitle, t]);

  const handleNavItemClick = (
    status: number | undefined,
    group: "status" | "channel",
    label: string
  ) => {
    setCurrentGroup(group);

    if (group === "status") {
      setSelectedTab("notification");
      setCurrentStatus(status);
    } else {
      setSelectedTab("channel");
      setCurrentStatus(undefined);
    }
    setNavItemsState(
      navItemsState.map((item) => ({
        ...item,
        active: item.label === label,
      }))
    );
  };

  return (
    <ThemeProvider settings={settings}>
      <div className="flex min-h-screen bg-background">
        <GlobalAuthListener />
        <aside className="w-64 px-4 py-6 border-r bg-card flex flex-col sticky top-0 h-screen overflow-y-auto">
          <h1 className="text-xl font-semibold text-center mb-4">
            {t("notification.title")}
          </h1>
          <div className="flex items-center mb-6">
            <Separator />
          </div>
          <nav className="flex-1">
            <ul className="space-y-1">
              {navItemsState.map((item) => (
                <li key={item.label}>
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-lg"
                    onClick={() =>
                      handleNavItemClick(item.status, item.group, item.label)
                    }
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            variant="outline"
            className="mt-8"
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4 mr-2" /> {t("other.home")}
          </Button>
        </aside>
        <main className="flex-1 px-10 py-8">
          {selectedTab === "notification" ? (
            <NotificationsView
              currentStatus={currentStatus}
              categoryName={
                navItemsState.find((item) => item.active)?.label ||
                t("notification.list")
              }
            />
          ) : (
            <ChannelsView />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
