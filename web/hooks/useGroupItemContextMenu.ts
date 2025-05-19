import { useState } from "react";
import type { GroupItem } from "@/lib/types/group";

interface ContextMenuState {
  item: GroupItem;
  groupId: number;
}

export function useGroupItemContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const handleContextMenu = (
    e: React.MouseEvent,
    item: GroupItem,
    groupId: number
  ) => {
    e.preventDefault();
    setContextMenu({ item, groupId });
  };

  return { contextMenu, setContextMenu, handleContextMenu };
}
