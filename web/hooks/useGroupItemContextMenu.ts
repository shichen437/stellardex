import { useState, useRef, useEffect } from "react";
import type { GroupItem } from "@/lib/types/group";

interface ContextMenuState {
  x: number;
  y: number;
  itemId: number;
  groupId: number;
}

export function useGroupItemContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setContextMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [contextMenu]);

  const handleContextMenu = (
    e: React.MouseEvent,
    item: GroupItem,
    groupId: number
  ) => {
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - 150);
    setContextMenu({ x, y, itemId: item.id, groupId });
  };

  return { contextMenu, contextMenuRef, setContextMenu, handleContextMenu };
}
