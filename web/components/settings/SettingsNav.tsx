interface SettingsNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useUserStore } from "@/lib/store/user";

export function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
  const userInfo = useUserStore((state) => state.userInfo);
  const tabs = [
    'profile',
    'interface',
    'site',
    'module',
    'groups',
    ...(userInfo?.isAdmin ? ['users'] : []),
    'support',
    'about'
  ];
  return (
    <div className="w-48 border-r border-gray-200 dark:border-gray-800 p-4">
      <h2 className="text-xl font-semibold mb-4 px-4 dark:text-gray-100">设置</h2>
      <SidebarMenu className="space-y-2">
        {tabs.map((tab) => (
          <SidebarMenuItem key={tab} className="px-2">
            <SidebarMenuButton
              isActive={activeTab === tab}
              onClick={() => onTabChange(tab)}
              className="w-full justify-start"
            >
              {{
                'profile': '我的信息',
                'interface': '界面管理', 
                'site': '站点管理',
                'module': '组件管理',
                'groups': '分组管理',
                'users': '用户管理',
                'support': '支持',
                'about': '关于'
              }[tab]}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}