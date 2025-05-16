import { RefObject } from 'react';
import type { Group } from '@/lib/types/group';

interface GroupItemContextMenuProps {
  contextMenu: {
    x: number;
    y: number;
    itemId: number;
    groupId: number;
  };
  contextMenuRef: RefObject<HTMLDivElement | null>;
  groupList: Group[];
  onEdit: (groupId: number, itemId: number) => void;
  onDelete: (groupId: number, itemId: number) => void;
  setContextMenu: (value: null) => void;
}

export function GroupItemContextMenu({
  contextMenu,
  contextMenuRef,
  groupList,
  onEdit,
  onDelete,
  setContextMenu
}: GroupItemContextMenuProps) {
  return (
    <div
      ref={contextMenuRef}
      className="fixed bg-white dark:bg-gray-800 shadow-lg rounded-lg py-1 z-50"
      style={{ top: contextMenu.y, left: contextMenu.x }}
    >
      <button
        onClick={() => {
          window.open(
            groupList
              .find((g) => g.id === contextMenu.groupId)
              ?.items.find((w) => w.id === contextMenu.itemId)?.url,
            "_blank"
          );
          setContextMenu(null);
        }}
        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        新窗口打开
      </button>
      <button
        onClick={() => {
          onEdit(contextMenu.groupId, contextMenu.itemId);
          setContextMenu(null);
        }}
        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        编辑
      </button>
      <button
        onClick={() => {
          onDelete(contextMenu.groupId, contextMenu.itemId);
          setContextMenu(null);
        }}
        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        删除
      </button>
    </div>
  );
}