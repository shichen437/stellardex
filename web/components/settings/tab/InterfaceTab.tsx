import type { SettingsState, InterfaceMode, ThemeMode, Language } from '@/lib/types/settings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InterfaceTabProps {
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}

export function InterfaceTab({ settings, onSettingsChange }: InterfaceTabProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-base font-medium">界面模式</h3>
          <Select
            value={settings.interfaceConfig.interfaceMode}
            onValueChange={(value) =>
              onSettingsChange({
                ...settings,
                interfaceConfig: {
                  ...settings.interfaceConfig,
                  interfaceMode: value as InterfaceMode,
                },
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择界面模式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="navigation">导航模式</SelectItem>
              <SelectItem value="simplicity">极简模式</SelectItem>
              <SelectItem value="homepage">主页模式</SelectItem>
              <SelectItem value="starry">星空模式</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-medium">主题</h3>
          <Select
            value={settings.interfaceConfig.themeMode}
            onValueChange={(value) =>
              onSettingsChange({
                ...settings,
                interfaceConfig: {
                  ...settings.interfaceConfig,
                  themeMode: value as ThemeMode,
                },
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择主题" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">跟随系统</SelectItem>
              <SelectItem value="light">浅色模式</SelectItem>
              <SelectItem value="dark">深色模式</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">语言</h3>
        <Select
          value={settings.interfaceConfig.language}
          onValueChange={(value) =>
            onSettingsChange({
              ...settings,
              interfaceConfig: {
                ...settings.interfaceConfig,
                language: value as Language,
              },
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择语言" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh-CN">简体中文</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}