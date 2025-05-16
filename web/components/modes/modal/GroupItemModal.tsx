import { useState, useEffect } from "react";
import { Sketch } from "@uiw/react-color";
import Image from "next/image";
import type { GroupItem } from "@/lib/types/group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { getContrastColor, getFaviconUrl } from "@/lib/utils";

interface GroupItemModalProps {
  item?: GroupItem | null;
  onClose: () => void;
  onSubmit: (item: GroupItem) => void;
  currentGroupId: number;
}

export function GroupItemModal({
  item,
  onClose,
  onSubmit,
  currentGroupId,
}: GroupItemModalProps) {
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [url, setUrl] = useState(item?.url || "");
  const [lanUrl, setLanUrl] = useState(item?.lanUrl || "");
  const [urlError, setUrlError] = useState("");
  const [iconType, setIconType] = useState<GroupItem["iconType"]>(
    item?.iconType || "text"
  );
  const [iconValue, setIconValue] = useState(item?.iconUrl || "");
  const [backgroundColor, setBackgroundColor] = useState(
    item?.bgColor || "#ffffff"
  );
  const [opacity, setOpacity] = useState(item?.opacity || 1);

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setUrl(item.url || "");
      setLanUrl(item.lanUrl || "");
      setIconType(item.iconType || "text");
      setIconValue(item.iconUrl || (item.iconType === "text" && item.title ? item.title.slice(0, 2) : ""));
      setBackgroundColor(item.bgColor || "#ffffff");
      setOpacity(item.opacity || 1);
    } else {
      setTitle("");
      setDescription("");
      setUrl("");
      setLanUrl("");
      setIconType("text");
      setIconValue("");
      setBackgroundColor("#ffffff");
      setOpacity(1);
    }
  }, [item]);


  useEffect(() => {
    if (iconType === "text" && title) {
      setIconValue(title.slice(0, 2));
    }
  }, [iconType, title]);

  const handleGetFavicon = () => {
    if (!url.trim()) {
      setUrlError("请先输入网站链接");
      return;
    }

    try {
      const faviconUrl = getFaviconUrl(url);
      if (!faviconUrl) throw new Error("无效链接");
      setIconType("image");
      setIconValue(faviconUrl);
      setUrlError("");
    } catch (error) {
      setUrlError("请输入有效的网站链接");
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const submittedItem: GroupItem = {
      id: item?.id ?? 0,
      groupId: item?.groupId ?? currentGroupId,
      title: title.trim(),
      description: description.trim() || undefined,
      url: url.trim(),
      lanUrl: lanUrl.trim() || undefined,
      iconType,
      iconUrl: iconType === "text" ? title.slice(0, 2) : iconValue.trim(),
      bgColor: backgroundColor,
      opacity,
      orderNum: item?.orderNum || 0,
    };

    onSubmit(submittedItem);
  };

  const PreviewCard = () => (
    <div
      className="relative h-[72px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      style={{
        backgroundColor: backgroundColor,
        opacity: opacity,
      }}
    >
      <div className="absolute inset-0 flex items-center p-4">
        {iconType === "text" ? (
          <div
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md text-xl font-bold"
            style={{
              backgroundColor: backgroundColor,
              color: backgroundColor ? getContrastColor(backgroundColor) : "#333",
            }}
          >
            {iconValue}
          </div>
        ) : (
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md overflow-hidden bg-white dark:bg-gray-800">
            {iconType === "image" && iconValue && (
              <Image
                src={iconValue}
                alt={title}
                width={40}
                height={40}
                className="object-contain"
                unoptimized={iconValue.startsWith("data:") || iconValue.startsWith("blob:")}
                onError={() => { }}
              />
            )}
            {iconType === "lucide" && iconValue && (
              <div
                className="text-gray-700 dark:text-gray-300 w-6 h-6"
                dangerouslySetInnerHTML={{
                  __html: iconValue,
                }}
              />
            )}
          </div>
        )}
        <div className={`flex-1 min-w-0 ${iconType !== "text" ? "ml-4" : "ml-4"}`}>
          <h4
            className="text-base font-medium truncate"
            style={{
              color: backgroundColor ? getContrastColor(backgroundColor) : 'inherit'
            }}
          >
            {title || "网站标题"}
          </h4>
          <p
            className="text-sm mt-1 truncate"
            style={{
              color: backgroundColor ? getContrastColor(backgroundColor, 0.7) : 'inherit'
            }}
          >
            {description || "网站描述"}
          </p>
        </div>
      </div>
    </div>
  );

  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
  }, [backgroundColor, opacity]);


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-popover dark:bg-popover rounded-lg shadow-xl w-full max-w-3xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">{item ? "编辑网站" : "添加网站"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium mb-3">预览</label>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
            <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-6">
              <div className="w-full sm:w-[360px]">
                <PreviewCard />
              </div>
              <div className="w-[120px] flex flex-col items-center">
                <div
                  className="w-16 h-16 flex items-center justify-center rounded-lg overflow-hidden mb-2"
                  style={{
                    backgroundColor: backgroundColor,
                    opacity: opacity,
                  }}
                >
                  {iconType === "text" ? (
                    <span
                      className="text-3xl font-bold"
                      style={{
                        color: backgroundColor ? getContrastColor(backgroundColor) : "#333",
                      }}
                    >
                      {iconValue}
                    </span>
                  ) : iconType === "image" && iconValue ? (
                    <Image
                      src={iconValue}
                      alt={title}
                      width={64}
                      height={64}
                      className="object-contain"
                      unoptimized={iconValue.startsWith("data:") || iconValue.startsWith("blob:")}
                    />
                  ) : iconType === "lucide" && iconValue ? (
                    <div
                      className="text-gray-700 dark:text-gray-300 w-10 h-10"
                      dangerouslySetInnerHTML={{
                        __html: iconValue,
                      }}
                    />
                  ) : null}
                </div>
                <span className="text-sm text-center truncate w-full text-gray-700 dark:text-gray-300">
                  {title || "网站标题"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="item-title" className="block text-sm font-medium mb-1">网站标题</label>
              <input
                id="item-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="请输入网站标题"
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="item-description" className="block text-sm font-medium mb-1">网站描述</label>
              <div className="relative">
                <input
                  id="item-description"
                  type="text"
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= 30) {
                      setDescription(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="请输入网站描述（最多30个字符）"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                  {description.length}/30
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="item-url" className="block text-sm font-medium mb-1">网站链接</label>
            <div className="flex gap-2">
              <input
                id="item-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (e.target.value.trim()) {
                    setUrlError("");
                  }
                }}
                className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="请输入网站链接"
                required
              />
              <Button
                type="button"
                onClick={handleGetFavicon}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md whitespace-nowrap"
                disabled={!url.trim()}
              >
                获取图标
              </Button>
            </div>
            {urlError && (
              <p className="mt-1 text-sm text-red-500">{urlError}</p>
            )}
          </div>

          <div>
            <label htmlFor="item-lan-url" className="block text-sm font-medium mb-1">局域网链接 (可选)</label>
            <input
              id="item-lan-url"
              type="url"
              value={lanUrl}
              onChange={(e) => setLanUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="请输入局域网链接"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">图标类型</label>
              <Select
                value={iconType}
                onValueChange={(value) => {
                  const newType = value as GroupItem["iconType"];
                  setIconType(newType);
                  if (newType === "text") {
                    setIconValue(title.slice(0, 2));
                  } else if (newType === "image") {
                    if (url.trim()) {
                      handleGetFavicon();
                    } else {
                      setIconValue("");
                    }
                  } else if (newType === "lucide") {
                    setIconValue("");
                  }
                }}
              >
                <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="选择图标类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">文字</SelectItem>
                  <SelectItem value="image">在线获取</SelectItem>
                  <SelectItem value="lucide">Lucide 图标</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">背景颜色与透明度</label>
              <div className="flex items-start gap-2">
                <div className="relative">
                  <Button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-10 h-10 rounded-md border dark:border-gray-600 overflow-hidden"
                    style={{
                      backgroundColor: backgroundColor,
                      opacity: opacity,
                    }}
                  />
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 z-20">
                      <Sketch
                        color={backgroundColor}
                        onChange={(colorResult) => {
                          setBackgroundColor(colorResult.hex);
                          setOpacity(
                            colorResult.rgba.a !== undefined
                              ? Number(colorResult.rgba.a.toFixed(4))
                              : 1
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    placeholder="#ffffff"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      setBackgroundColor("#ffffff");
                      setOpacity(1);
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md whitespace-nowrap"
                  >
                    重置
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {iconType !== "text" && (
            <div>
              <label htmlFor="item-icon-value" className="block text-sm font-medium mb-1">
                {iconType === "image" && "图片链接"}
                {iconType === "lucide" && "Lucide图标 SVG"}
              </label>
              <input
                id="item-icon-value"
                type={iconType === "image" ? "url" : "text"}
                value={iconValue}
                onChange={(e) => setIconValue(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder={
                  iconType === "image"
                    ? "请输入图片链接"
                    : "请输入 Lucide 图标的 SVG 代码"
                }
                disabled={iconType === "image" && url.trim() !== "" && getFaviconUrl(url) === iconValue}
              />
              {iconType === "lucide" && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  请从{" "}
                  <a
                    href="https://lucide.dev/icons/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Lucide Icons
                  </a>{" "}
                  选择图标并复制 SVG 代码。
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-4 py-2 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              取消
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {item ? "保存更改" : "确定添加"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}