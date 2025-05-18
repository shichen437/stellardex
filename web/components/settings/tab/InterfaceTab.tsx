import type { SettingsState, InterfaceMode, ThemeMode, Language } from '@/lib/types/settings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePolyglot } from "@/providers/PolyglotProvider";

interface InterfaceTabProps {
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}

export function InterfaceTab({ settings, onSettingsChange }: InterfaceTabProps) {
  const { t } = usePolyglot();
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-base font-medium">{t("apperance.interfaceMode")}</h3>
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
              <SelectItem value="navigation">{t("apperance.navigationMode")}</SelectItem>
              <SelectItem value="homepage">{t("apperance.homepageMode")}</SelectItem>
              <SelectItem value="simplicity">{t("apperance.simplicityMode")}</SelectItem>
              <SelectItem value="starry">{t("apperance.starryMode")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-medium">{t("apperance.theme")}</h3>
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
              <SelectItem value="system">{t("apperance.theme_system")}</SelectItem>
              <SelectItem value="light">{t("apperance.theme_light")}</SelectItem>
              <SelectItem value="dark">{t("apperance.theme_dark")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">{t("apperance.language")}</h3>
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