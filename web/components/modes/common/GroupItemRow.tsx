import Image from "next/image";
import type { GroupItem } from "@/lib/types/group";

interface RowItemIconProps {
  item: GroupItem;
  getContrastColor: (color: string) => string;
}

export function RowItemIcon({ item, getContrastColor }: RowItemIconProps) {
  if (!item.iconType) return null;

  if (item.iconType === "text") {
    return (
      <div
        className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl text-2xl font-bold"
        style={{
          backgroundColor: item?.bgColor || "#f3f4f6",
          color: item?.bgColor
            ? getContrastColor(item.bgColor)
            : "#333",
        }}
      >
        {item.title.slice(0, 2)}
      </div>
    );
  }

  if (item.iconType === "image") {
    return (
      <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden">
        <Image
          src={item.iconUrl}
          alt={item.title}
          width={56}
          height={56}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl">
      <div
        className="text-gray-700 dark:text-gray-300 w-12 h-12 flex items-center justify-center overflow-hidden"
        dangerouslySetInnerHTML={{
          __html: item.iconUrl,
        }}
      />
    </div>
  );
}