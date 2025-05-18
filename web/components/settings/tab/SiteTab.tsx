import type { SettingsState } from '@/lib/types/settings';
import { useState, useEffect } from 'react';
import { usePolyglot } from "@/providers/PolyglotProvider";

interface SiteManagementTabProps {
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}

export function SiteManagementTab({ settings, onSettingsChange }: SiteManagementTabProps) {
  const [siteTitle, setSiteTitle] = useState(settings.siteConfig.siteTitle || '');
  const [siteFooter, setSiteFooter] = useState(settings.siteConfig.siteFooter || '');
  const { t } = usePolyglot();

  useEffect(() => {
    const newTitle = settings.siteConfig.siteTitle || '';
    setSiteTitle(newTitle.slice(0, 10));
    if (newTitle) {
      document.title = newTitle;
    }
    setSiteFooter((settings.siteConfig.siteFooter || '').slice(0, 30));
  }, [settings.siteConfig.siteTitle, settings.siteConfig.siteFooter]);

  const handleSiteTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.slice(0, 20);
    setSiteTitle(newTitle);
    onSettingsChange({
      ...settings,
      siteConfig: {
        ...settings.siteConfig,
        siteTitle: newTitle,
      },
    });
    if (newTitle) {
      document.title = newTitle;
    }
  };

  const handleSiteFooterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFooter = e.target.value.slice(0, 50);
    setSiteFooter(newFooter);
    onSettingsChange({
      ...settings,
      siteConfig: {
        ...settings.siteConfig,
        siteFooter: newFooter,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-medium">{t("site.title")}</h3>
          <span className="text-sm text-gray-500">{siteTitle.length}/20</span>
        </div>
        <input
          type="text"
          value={siteTitle}
          onChange={handleSiteTitleChange}
          placeholder="例如：我的导航主页"
          maxLength={10}
          className="w-full px-3 py-2 border rounded-md dark:bg-black dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-medium">{t("site.footer")}</h3>
          <span className="text-sm text-gray-500">{siteFooter.length}/50</span>
        </div>
        <input
          type="text"
          value={siteFooter}
          onChange={handleSiteFooterChange}
          placeholder="例如：© 2024 我的站点"
          maxLength={30}
          className="w-full px-3 py-2 border rounded-md dark:bg-black dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}