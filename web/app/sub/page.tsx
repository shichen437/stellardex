/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/user";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSettingsStore } from "@/lib/store/settings";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { type NavItem } from "@/lib/types/subscription";
import { getNavItems } from "@/lib/consts/subscription-nav";
import { CurrencyView } from "@/components/subscription/views/CurrencyView";
import { SubView } from "@/components/subscription/views/SubView";
import { OverviewView } from "@/components/subscription/views/OverviewView";

function GlobalAuthListener() {
  useAuth();
  return null;
}
export default function SubscriptionPage() {
  const { t } = usePolyglot();
  const router = useRouter();
  const userInfo = useUserStore((state) => state.userInfo);
  const settings = useSettingsStore((state) => state.settings);
  const getSettings = useSettingsStore((state) => state.getSettings);
  const [navItemsState, setNavItemsState] = useState<NavItem[]>(() =>
    getNavItems(t)
  );
  const [currentGroup, setCurrentGroup] = useState<string | undefined>(
    "overview"
  );
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "sub" | "currency"
  >("overview");

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
        settings.siteConfig.siteTitle + " | " + t("subscription.title");
    } else {
      document.title = t("subscription.title");
    }
  }, [settings?.siteConfig?.siteTitle, t]);

  const handleNavItemClick = (
    group: "overview" | "sub" | "currency",
    label: string
  ) => {
    setCurrentGroup(group);
    setSelectedTab(group);
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
            {t("subscription.title")}
          </h1>
          <div className="flex items-center mb-6">
            <Separator />
          </div>
          <nav className="flex-1">
            <ul className="space-y-1">
              {navItemsState.map((item) => {
                if (item.needAdmin && !userInfo?.isAdmin) {
                  return null;
                }
                return (
                  <li key={item.label}>
                    <Button
                      variant={item.active ? "secondary" : "ghost"}
                      className="w-full flex justify-between items-center px-3 py-2 rounded-lg"
                      onClick={() => handleNavItemClick(item.group, item.label)}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </span>
                    </Button>
                  </li>
                );
              })}
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
        <main className="flex-1 min-w-0 px-10 py-8">
          {selectedTab === "overview" ? (
            <OverviewView />
          ) : selectedTab === "sub" ? (
            <SubView />
          ) : selectedTab === "currency" ? (
            <CurrencyView />
          ) : null}
        </main>
      </div>
    </ThemeProvider>
  );
}
