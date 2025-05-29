import type { SettingsState } from "@/lib/types/settings";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileTab } from "./tab/ProfileTab";
import { GroupsTab } from "./tab/GroupsTab";
import { ModuleTab } from "./tab/ModuleTab";
import { InterfaceTab } from "./tab/InterfaceTab";
import { SiteManagementTab } from "./tab/SiteTab";
import { AboutTab } from "./tab/AboutTab";
import { SupportTab } from "./tab/SupportTab";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  LogOut,
  Settings as SettingsIcon,
  CircleUserRound,
  Palette,
  LayoutDashboard,
  Puzzle,
  Group,
  Info,
  Coffee,
  Users,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { SidebarInset } from "@/components/ui/sidebar";
import { LogoutModal } from "./modal/LogoutModal";
import { useUserStore } from "@/lib/store/user";
import { UsersTab } from "./tab/UsersTab";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { compareVersion } from "@/lib/utils";

interface SettingsPanelProps {
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
  onClose: () => void;
}

export function SettingsPanel({
  settings,
  onSettingsChange,
  onClose,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const logoutStore = useUserStore((state) => state.logout);
  const { t } = usePolyglot();

  useEffect(() => {
    // 只在弹窗挂载时执行
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutStore();
    } catch (e) {
      console.error(e);
    } finally {
      router.push("/login");
    }
  };

  const userInfo = useUserStore((state) => state.userInfo);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "interface":
        return (
          <InterfaceTab
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        );
      case "site":
        return (
          <SiteManagementTab
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        );
      case "groups":
        return (
          <GroupsTab settings={settings} onSettingsChange={onSettingsChange} />
        );
      case "module":
        return (
          <ModuleTab settings={settings} onSettingsChange={onSettingsChange} />
        );
      case "users":
        return <UsersTab />;
      case "support":
        return <SupportTab />;
      case "about":
        return <AboutTab />;
      default:
        return <div>{t("common.developing")}</div>;
    }
  };

  const menuItems = [
    {
      id: "profile",
      label: t("sidebar.profile"),
      icon: <CircleUserRound className="w-4 h-4" />,
    },
    {
      id: "interface",
      label: t("sidebar.interface"),
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: "site",
      label: t("sidebar.site"),
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "module",
      label: t("sidebar.module"),
      icon: <Puzzle className="w-4 h-4" />,
    },
    {
      id: "groups",
      label: t("sidebar.groups"),
      icon: <Group className="w-4 h-4" />,
    },
    ...(userInfo?.isAdmin
      ? [
          {
            id: "users",
            label: t("sidebar.users"),
            icon: <Users className="w-4 h-4" />,
          },
        ]
      : []),
    {
      id: "support",
      label: t("sidebar.support"),
      icon: <Coffee className="w-4 h-4" />,
    },
    {
      id: "about",
      label: (
        <span className="relative">
          {t("sidebar.about")}
          {compareVersion() && (
            <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full align-middle"></span>
          )}
        </span>
      ),
      icon: <Info className="w-4 h-4" />,
    },
  ];

  return (
    <SidebarProvider>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 md:p-8">
        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-xl w-full max-w-5xl h-[90vh] md:h-[80vh] flex overflow-hidden border dark:border-neutral-800">
          <Sidebar
            variant="inset"
            collapsible="none"
            className={`${
              isCollapsed ? "w-16" : "w-56 md:w-64"
            } border-r dark:border-neutral-800 flex flex-col transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[width]`}
          >
            <SidebarHeader className="p-4 border-b dark:border-neutral-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                  <SettingsIcon className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
                </div>
                {!isCollapsed && (
                  <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                    {t("sidebar.title")}
                  </h2>
                )}
              </div>
            </SidebarHeader>
            <SidebarContent className="flex-1 overflow-y-auto p-2">
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id} className="px-2">
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="w-full justify-start"
                    >
                      <a
                        href="#"
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        {item.icon}
                        {!isCollapsed && item.label}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t dark:border-neutral-800">
              <SidebarMenu>
                <SidebarMenuItem className="px-0">
                  {" "}
                  {/* 修改为px-0 */}
                  <SidebarMenuButton
                    onClick={() => setLogoutOpen(true)}
                    className="w-full justify-center text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <a
                      href="#"
                      className="flex items-center justify-center w-full"
                    >
                      {" "}
                      <LogOut className="w-5 h-5" />
                      {!isCollapsed && t("logout.title")}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
                >
                  {isCollapsed ? (
                    <PanelLeftOpen className="w-5 h-5" />
                  ) : (
                    <PanelLeftClose className="w-5 h-5" />
                  )}
                </button>
                <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                  {t(`sidebar.${activeTab}`)}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="关闭设置"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
          </SidebarInset>
        </div>
      </div>
      <LogoutModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
      />
    </SidebarProvider>
  );
}
