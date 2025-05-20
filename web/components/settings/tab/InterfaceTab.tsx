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
          <h3 className="text-base font-medium">{t("appearance.interfaceMode")}</h3>
          <Select
            value={settings.interfaceConfig?.interfaceMode}
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
              <SelectValue placeholder={t("appearance.placeholder.interfaceMode")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="navigation">{t("appearance.navigationMode")}</SelectItem>
              <SelectItem value="homepage">{t("appearance.homepageMode")}</SelectItem>
              <SelectItem value="simplicity">{t("appearance.simplicityMode")}</SelectItem>
              <SelectItem value="starry">{t("appearance.starryMode")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-medium">{t("appearance.theme")}</h3>
          <Select
            value={settings.interfaceConfig?.themeMode}
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
              <SelectValue placeholder={t("appearance.placeholder.theme")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">{t("appearance.theme_system")}</SelectItem>
              <SelectItem value="light">{t("appearance.theme_light")}</SelectItem>
              <SelectItem value="dark">{t("appearance.theme_dark")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">{t("appearance.language")}</h3>
        <Select
          value={settings.interfaceConfig?.language}
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
            <SelectValue placeholder={t("appearance.placeholder.language")} />
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