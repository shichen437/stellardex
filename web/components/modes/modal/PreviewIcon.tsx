import Image from "next/image";
import { getContrastColor } from "@/lib/utils";

type PreviewIconProps = {
  iconType: "text" | "image" | "lucide" | "local";
  iconUrl: string;
  title: string;
  bgColor?: string;
  opacity?: number;
};

export function PreviewIcon({
  iconType,
  iconUrl,
  title,
  bgColor,
  opacity = 1,
}: PreviewIconProps) {
  let srcUrl = iconUrl;
  if (iconType === "local") {
    srcUrl = `${process.env.NEXT_PUBLIC_API_PREFIX}${iconUrl}`;
  }
  return (
    <div
      className="w-16 h-16 flex items-center justify-center rounded-lg overflow-hidden mb-2"
      style={
        iconType === "image"
          ? undefined
          : {
              backgroundColor: bgColor,
              opacity: opacity,
            }
      }
    >
      {iconType === "text" ? (
        <span
          className="text-3xl font-bold"
          style={{
            color: bgColor ? getContrastColor(bgColor) : "#333",
          }}
        >
          {iconUrl}
        </span>
      ) : (iconType === "image" || iconType === "local") && iconUrl ? (
        <Image
          src={srcUrl}
          alt={title}
          width={64}
          height={64}
          className="object-contain"
          unoptimized={
            iconUrl.startsWith("data:") || iconUrl.startsWith("blob:")
          }
        />
      ) : iconType === "lucide" && iconUrl ? (
        <div
          className="text-gray-700 dark:text-gray-300 w-12 h-12 flex items-center justify-center overflow-hidden"
          dangerouslySetInnerHTML={{
            __html: iconUrl,
          }}
        />
      ) : null}
    </div>
  );
}
