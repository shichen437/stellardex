import type { SettingsState } from '@/lib/types/settings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface PersonalizationTabProps {
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}

export function ModuleTab({ settings, onSettingsChange }: PersonalizationTabProps) {
  const { t } = usePolyglot();
  return (
    <div className="space-y-8">
      {/* 主页部分 */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t("module.homepage") || "主页"}</h3>
        <div className="grid grid-cols-2 gap-4 gap-x-10">
          <div className="flex items-center justify-between">
            <span>{t("module.showMeteors")}</span>
            <Switch
              checked={settings.moduleConfig.showMeteors || false}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                moduleConfig: {
                  ...settings.moduleConfig,
                  showMeteors: checked
                }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>{t("module.showMonitor")}</span>
            <Switch
              checked={settings.moduleConfig.showMonitor}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                moduleConfig: {
                  ...settings.moduleConfig,
                  showMonitor: checked
                }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>{t("module.showSearchBar")}</span>
            <Switch
              checked={settings.moduleConfig.showSearchBar}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                moduleConfig: {
                  ...settings.moduleConfig,
                  showSearchBar: checked
                }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>{t("module.showTime")}</span>
            <Switch
              checked={settings.moduleConfig.showClock}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                moduleConfig: {
                  ...settings.moduleConfig,
                  showClock: checked
                }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>{t("module.showCalendar")}</span>
            <Switch
              checked={settings.moduleConfig.showCalendar}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                moduleConfig: {
                  ...settings.moduleConfig,
                  showCalendar: checked
                }
              })}
            />
          </div>

          {settings.moduleConfig.showCalendar && (
            <div className="flex items-center justify-between">
              <span>{t("module.dateFormat")}</span>
              <Select
                value={settings.moduleConfig.calendarFormat}
                onValueChange={(value) => onSettingsChange({
                  ...settings,
                  moduleConfig: {
                    ...settings.moduleConfig,
                    calendarFormat: value as SettingsState['moduleConfig']['calendarFormat']
                  }
                })}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t("module.placeholder.dateFormat")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* 功能部分 */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t("module.features") || "功能"}</h3>
        <div className="grid grid-cols-2 gap-4 gap-x-10">
          <div className="flex items-center justify-between">
            <span>{t("module.showBookmarks")}</span>
            <Switch
              checked={settings.moduleConfig.showBookmarks}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                moduleConfig: {
                  ...settings.moduleConfig,
                  showBookmarks: checked
                }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>{t("module.showNotification")}</span>
            <Switch
              checked={settings.moduleConfig.showNotification}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                moduleConfig: {
                  ...settings.moduleConfig,
                  showNotification: checked
                }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>{t("module.showSubscription")}</span>
            <Switch
              checked={settings.moduleConfig.showSubscription}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                moduleConfig: {
                  ...settings.moduleConfig,
                  showSubscription: checked
                }
              })}
            />
          </div>
        </div>
      </div>

    </div>
  );
}