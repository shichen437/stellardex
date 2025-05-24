import Image from "next/image";
import { getContrastColor } from "@/lib/utils";

type PreviewCardProps = {
  title?: string;
  description?: string;
  iconType: "text" | "image" | "lucide" | "local";
  iconUrl: string;
  bgColor: string;
  opacity: number;
};

export function PreviewCard({
  title,
  description,
  iconType,
  iconUrl,
  bgColor,
  opacity,
}: PreviewCardProps) {
  let srcUrl = iconUrl;
  if (iconType === "local") {
    srcUrl = `${process.env.NEXT_PUBLIC_API_PREFIX}${iconUrl}`;
  }
  return (
    <div
      className="relative h-[72px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      style={{
        backgroundColor: bgColor,
        opacity: opacity,
      }}
    >
      <div className="absolute inset-0 flex items-center p-4">
        {iconType === "text" ? (
          <div
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md text-xl font-bold"
            style={{
              backgroundColor: bgColor,
              color: bgColor ? getContrastColor(bgColor) : "#333",
            }}
          >
            {iconUrl}
          </div>
        ) : (
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md overflow-hidden">
            {(iconType === "image" || iconType === "local") && iconUrl && (
              <Image
                src={srcUrl}
                alt={title || ""}
                width={40}
                height={40}
                className="object-contain"
                unoptimized={
                  iconUrl.startsWith("data:") || iconUrl.startsWith("blob:")
                }
                onError={() => {}}
              />
            )}
            {iconType === "lucide" && iconUrl && (
              <div
                className="text-gray-700 dark:text-gray-300 w-12 h-12 flex items-center justify-center overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: iconUrl,
                }}
              />
            )}
          </div>
        )}
        <div className="flex-1 min-w-0 ml-4">
          <h4
            className="text-base font-medium truncate"
            style={{
              color: bgColor ? getContrastColor(bgColor) : "inherit",
            }}
          >
            {title}
          </h4>
          <p
            className="text-sm mt-1 truncate"
            style={{
              color: bgColor ? getContrastColor(bgColor, 0.7) : "inherit",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
