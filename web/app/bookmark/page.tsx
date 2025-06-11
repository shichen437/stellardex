/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { TagsView } from "@/components/bookmarks/views/TagsView";
import { SelectorsView } from "@/components/bookmarks/views/SelectorsView";
import { BookmarksView } from "@/components/bookmarks/views/BookmarksView";
import { type NavItem } from "@/lib/types/bookmark";
import { useSettingsStore } from "@/lib/store/settings";
import { getNavItems } from "@/lib/consts/bookmark-nav";
import { getBookmarkNum } from "@/api/bookmark/bookmark";
import { Separator } from "@/components/ui/separator";

function GlobalAuthListener() {
  useAuth();
  return null;
}

export default function BookmarkPage() {
  const router = useRouter();
  const settings = useSettingsStore((state) => state.settings);
  const getSettings = useSettingsStore((state) => state.getSettings);
  const { t } = usePolyglot();
  const [navItemsState, setNavItemsState] = useState<NavItem[]>(() =>
    getNavItems(t)
  );

  const [selectedTab, setSelectedTab] = useState<
    "bookmarks" | "tags" | "selectors"
  >("bookmarks");
  const [currentStatus, setCurrentStatus] = useState<number | undefined>(
    undefined
  );
  const [currentGroup, setCurrentGroup] = useState<string | undefined>(
    "status"
  );
  const [currentIsArchive, setCurrentIsArchive] = useState<number | undefined>(
    undefined
  );
  const [currentIsStarred, setCurrentIsStarred] = useState<number | undefined>(
    undefined
  );

  const fetchBookmarkNum = async () => {
    const res = await getBookmarkNum();
    if (res.code === 0) {
      const newNavItems = (navItemsState || []).map((item) => {
        switch (item.labelKey) {
          case "bookmark.nav.all":
            return { ...item, count: res.data.total };
          case "bookmark.nav.unread":
            return { ...item, count: res.data.unread };
          case "bookmark.nav.read":
            return { ...item, count: res.data.read };
          case "bookmark.nav.archive":
            return { ...item, count: res.data.archive };
          case "bookmark.nav.favorite":
            return { ...item, count: res.data.star };
          case "bookmark.nav.tags":
            return { ...item, count: res.data.label };
          case "bookmark.nav.selectors":
            return { ...item, count: res.data.selector };
          default:
            return item;
        }
      });
      setNavItemsState(newNavItems);
    } else {
      toast.error(res.msg);
    }
  };

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  useEffect(() => {
    fetchBookmarkNum();
  }, []);

  useEffect(() => {
    setNavItemsState((prev) =>
      prev.map((item) => ({
        ...item,
        label: t(item.labelKey),
      }))
    );
  }, [t]);

  const handleNavItemClick = (
    status: number | undefined,
    group: "status" | "archive" | "starred" | "tags" | "selector",
    label: string,
    isArchive?: number,
    isStarred?: number
  ) => {
    setCurrentGroup(group);
    setCurrentStatus(undefined);
    setCurrentIsArchive(undefined);
    setCurrentIsStarred(undefined);

    if (group === "archive" || group === "starred" || group === "status") {
      setSelectedTab("bookmarks");
      if (group === "status") setCurrentStatus(status);
      if (group === "archive") setCurrentIsArchive(isArchive);
      if (group === "starred") setCurrentIsStarred(isStarred);
    } else if (group === "tags") {
      setSelectedTab("tags");
    } else if (group === "selector") {
      setSelectedTab("selectors");
    }

    setNavItemsState(
      navItemsState.map((item) => ({
        ...item,
        active: item.label === label,
      }))
    );
  };

  const getCurrentCategoryName = () => {
    return navItemsState.find((item) => item.active)?.label || "全部";
  };

  return (
    <ThemeProvider settings={settings}>
      <div className="flex min-h-screen bg-background">
        <GlobalAuthListener />
        <aside className="w-64 px-4 py-6 border-r bg-card flex flex-col sticky top-0 h-screen overflow-y-auto">
          <h1 className="text-xl font-semibold text-center mb-4">
            {t("bookmark.title")}
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
                      handleNavItemClick(
                        item.status,
                        item.group,
                        item.label,
                        item.isArchive,
                        item.isStarred
                      )
                    }
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    {item.count !== undefined && (
                      <span className="text-xs text-muted-foreground font-medium">
                        {item.count}
                      </span>
                    )}
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
          {selectedTab === "bookmarks" ? (
            <BookmarksView
              categoryName={getCurrentCategoryName()}
              currentStatus={currentStatus}
              currentGroup={currentGroup}
              isArchive={currentIsArchive}
              isStarred={currentIsStarred}
              onUpdateBookmarkNum={fetchBookmarkNum}
            />
          ) : selectedTab === "tags" ? (
            <TagsView onUpdateBookmarkNum={fetchBookmarkNum} />
          ) : (
            <SelectorsView onUpdateBookmarkNum={fetchBookmarkNum} />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
