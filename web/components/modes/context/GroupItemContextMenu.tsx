import type { GroupItem } from "@/lib/types/group";
import { usePolyglot } from "@/providers/PolyglotProvider";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Edit, Trash2, ExternalLink } from "lucide-react";

interface GroupItemContextMenuProps {
  item: GroupItem;
  groupId: number;
  onEdit: (item: GroupItem) => void;
  onDelete: (item: GroupItem) => void;
  children: React.ReactNode;
}

export function GroupItemContextMenu({
  item,
  onEdit,
  onDelete,
  children,
}: GroupItemContextMenuProps) {
  const { t } = usePolyglot();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-1">
        <ContextMenuItem
          onClick={() => window.open(item?.url, "_blank")}
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4 text-gray-400" />
          {t("contextMenu.newTab")}
        </ContextMenuItem>
        {item?.lanUrl && item.lanUrl !== "" && (
          <ContextMenuItem
            onClick={() => window.open(item.lanUrl, "_blank")}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
            {t("contextMenu.lanUrl")}
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => onEdit(item)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4 text-gray-400" />
          {t("common.edit")}
        </ContextMenuItem>
        <ContextMenuItem
          variant="destructive"
          onClick={() => onDelete(item)}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
          {t("common.delete")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
