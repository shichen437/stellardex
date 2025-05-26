import type {
  SettingsState,
  InterfaceMode,
  ThemeMode,
  Language,
} from "@/lib/types/settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import Image from "next/image";
import { WallpaperSelectModal } from "../modal/WallpaperSelectModal";
import { postBgImg } from "@/api/settings";
import { toast } from "sonner";

interface InterfaceTabProps {
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}

export function InterfaceTab({
  settings,
  onSettingsChange,
}: InterfaceTabProps) {
  const { t } = usePolyglot();
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [tempBlur, setTempBlur] = useState(settings.interfaceConfig?.bgImageBlurred || 0);
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error(t("appearance.error.uploadLimit"));
      return;
    }

    const formData = new FormData();
    formData.append("bgImage", file);

    try {
      const response = await postBgImg(formData);
      if (response.code === 0) {
        toast.success(t("toast.uploadSuccess"));
        onSettingsChange({
          ...settings,
          interfaceConfig: {
            ...settings.interfaceConfig,
            bgImage: `${response.data.imageUrl}`,
          },
        });
      } else {
        toast.error(t("toast.uploadError"));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(t("toast.uploadError"));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-base font-medium">
            {t("appearance.interfaceMode")}
          </h3>
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
              <SelectValue
                placeholder={t("appearance.placeholder.interfaceMode")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="navigation">
                {t("appearance.navigationMode")}
              </SelectItem>
              <SelectItem value="homepage">
                {t("appearance.homepageMode")}
              </SelectItem>
              <SelectItem value="simplicity">
                {t("appearance.simplicityMode")}
              </SelectItem>
              <SelectItem value="starry">
                {t("appearance.starryMode")}
              </SelectItem>
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
              <SelectItem value="system">
                {t("appearance.theme_system")}
              </SelectItem>
              <SelectItem value="light">
                {t("appearance.theme_light")}
              </SelectItem>
              <SelectItem value="dark">{t("appearance.theme_dark")}</SelectItem>
            </SelectContent>
          </Select>
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

      <div className="space-y-6">
        <h3 className="text-base font-medium">{t("appearance.wallpaper")}</h3>

        <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden group">
          {settings.interfaceConfig?.bgImage ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_PREFIX}${settings.interfaceConfig.bgImage}`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={1080}
              style={{
                filter: `blur(${settings.interfaceConfig?.bgImageBlurred || 0}px)`,
              }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-popover" />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="outline"
              className="w-40 bg-white/90 hover:bg-white"
              onClick={() => setShowWallpaperModal(true)}
            >
              {t("appearance.moreWallpapers")}
            </Button>
            <Button
              variant="outline"
              className="w-40 bg-white/90 hover:bg-white"
              onClick={() =>
                document.getElementById("wallpaper-upload")?.click()
              }
            >
              {t("appearance.uploadWallpaper")}
            </Button>
            <input
              id="wallpaper-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {settings.interfaceConfig?.bgImage && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm">{t("appearance.blurred")}</span>
              <Slider
                value={[tempBlur]}
                onValueChange={(value) => {
                  setTempBlur(value[0]);
                  const img = document.querySelector('img') as HTMLImageElement;
                  if (img) {
                    img.style.filter = `blur(${value[0]}px)`;
                  }
                }}
                onValueCommit={(value) => {
                  onSettingsChange({
                    ...settings,
                    interfaceConfig: {
                      ...settings.interfaceConfig,
                      bgImageBlurred: value[0],
                    },
                  });
                }}
                max={10}
                step={0.1}
                className="flex-1"
              />
            </div>
          </div>
        )}
      </div>

      <WallpaperSelectModal
        open={showWallpaperModal}
        onOpenChange={setShowWallpaperModal}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </div>
  );
}
