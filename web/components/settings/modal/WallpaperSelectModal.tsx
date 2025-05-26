import { usePolyglot } from "@/providers/PolyglotProvider";
import { useEffect, useState } from "react";
import { getBgImgList, deleteBgImg } from "@/api/settings";
import Image from "next/image";
import { SettingsState } from "@/lib/types/settings";
import { useInView } from "react-intersection-observer";
import { Check, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WallpaperSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}

interface WallpaperItem {
  id: number;
  url: string;
}

export function WallpaperSelectModal({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: WallpaperSelectModalProps) {
  const { t } = usePolyglot();
  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  const loadWallpapers = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getBgImgList({
        pageNum: page,
        pageSize: 10
      });
      const newWallpapers = res.data.rows;
      if (newWallpapers.length === 0 || newWallpapers.length < 10) {
        setHasMore(false);
      }
      setWallpapers((prev) => [...prev, ...newWallpapers]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load wallpapers:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView) {
      loadWallpapers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (open) {
      setWallpapers([]);
      setPage(1);
      setHasMore(true);
      loadWallpapers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSelect = (url: string | "") => {
    onSettingsChange({
      ...settings,
      interfaceConfig: {
        ...settings.interfaceConfig,
        bgImage: url,
        bgImageBlurred: 0,
      },
    });
    onOpenChange(false);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteBgImg(id);
      setWallpapers((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      console.error("Failed to delete wallpaper:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white dark:bg-popover w-[60vw] h-[60vh] rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">
            {t("appearance.moreWallpapers")}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="overflow-y-auto h-[calc(60vh-80px)] p-6">
          <div className="grid grid-cols-3 gap-6">
            <div
              className={`relative w-full pt-[56.25%] rounded-lg overflow-hidden cursor-pointer bg-gray-100 dark:bg-popover hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${
                !settings.interfaceConfig?.bgImage
                  ? "ring-2 ring-primary ring-offset-2"
                  : ""
              }`}
              onClick={() => handleSelect("")}
            >
              {!settings.interfaceConfig?.bgImage && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary/90 dark:bg-black/30 text-white dark:text-white/90 rounded-full flex items-center justify-center shadow-sm">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            {wallpapers.map((wallpaper) => {
              const isSelected =
                wallpaper.url === settings.interfaceConfig?.bgImage;
              return (
                <div
                  key={wallpaper.id}
                  className={`relative w-full pt-[56.25%] rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-all ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
                  onClick={() => handleSelect(wallpaper.url)}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_PREFIX}${wallpaper.url}`}
                    alt="Wallpaper option"
                    width={1920}
                    height={1080}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {isSelected ? (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary/90 dark:bg-black/30 text-white dark:text-white/90 rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <div
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500/90 dark:bg-red-500/70 text-white dark:text-white/90 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-red-600/90 dark:hover:bg-red-600/70"
                      onClick={(e) => handleDelete(wallpaper.id, e)}
                    >
                      <Trash className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
            {hasMore && (
              <div
                ref={ref}
                className="col-span-3 h-8 flex items-center justify-center"
              >
                {loading ? t("common.loading") : ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
