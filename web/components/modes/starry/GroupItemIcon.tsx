import type { GroupItem } from "@/lib/types/group";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GroupItemIconProps {
    item: GroupItem;
    size: number;
}

export function GroupItemIcon({ item, size }: GroupItemIconProps) {
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
                <span className={size === 48 ? "text-lg font-bold" : "text-sm font-bold"}>{item.iconUrl}</span>
            ) : item.iconType === "image" ? (
                <Image
                    src={item.iconUrl}
                    alt={""}
                    className="w-full h-full object-contain rounded-full"
                    width={size}
                    height={size}
                    priority
                />
            ) : (
                <span className="w-full h-full rounded-full" dangerouslySetInnerHTML={{ __html: item.iconUrl }} />
            )}
        </div>
    );

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {iconContent}
            </TooltipTrigger>
            <TooltipContent>{item.title}</TooltipContent>
        </Tooltip>
    );
}