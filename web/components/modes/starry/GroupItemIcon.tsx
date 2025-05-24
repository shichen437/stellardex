import type { GroupItem } from "@/lib/types/group";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GroupItemIconProps {
  item: GroupItem;
  size: number;
}

export function GroupItemIcon({ item, size }: GroupItemIconProps) {
  let srcUrl = item.iconUrl;
  if (item.iconType === "local") {
    srcUrl = `${process.env.NEXT_PUBLIC_API_PREFIX}${item.iconUrl}`;
  }
  const iconContent = (
    <div
      className="flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-transform"
      style={{
        width: "100%",
        height: "100%",
      }}
      onClick={() => window.open(item.url, "_blank")}
    >
      {item.iconType === "text" ? (
        <span
          className={size === 48 ? "text-lg font-bold" : "text-sm font-bold"}
        >
          {item.iconUrl}
        </span>
      ) : item.iconType === "image" || item.iconType === "local" ? (
        <Image
          src={srcUrl}
          alt={""}
          className="w-full h-full object-contain rounded-full"
          width={size}
          height={size}
          priority
        />
      ) : (
        <div
          key={item.id}
          className="w-full h-full rounded-full flex items-center justify-center"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          dangerouslySetInnerHTML={{ __html: item.iconUrl }}
        />
      )}
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{iconContent}</TooltipTrigger>
      <TooltipContent>{item.title}</TooltipContent>
    </Tooltip>
  );
}
