import type { GroupItem } from "@/lib/types/group";
import { RowItemIcon } from "./RowItemIcon";
import { getContrastColor } from "../../../lib/utils";
import { GroupItemContextMenu } from "../context/GroupItemContextMenu";

interface GroupItemGridProps {
  items: GroupItem[];
  displayType: string;
  onContextMenu: (e: React.MouseEvent, item: GroupItem, groupId: number) => void;
  groupId: number;
  contextMenu: { item: GroupItem; groupId: number } | null;
  onEdit: (item: GroupItem) => void;
  onDelete: (item: GroupItem) => void;
  setContextMenu: (value: null) => void;
}

export function GroupItemGrid({ 
  items, 
  displayType, 
  onEdit,
  onDelete,
  groupId
}: GroupItemGridProps) {
  const renderGroupItem = (item: GroupItem) => {
    if (displayType === "titles") {
      return (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block hover:text-blue-600 border-b border-dashed border-gray-200 dark:border-gray-700"
        >
          <h4 className="text-base font-medium">{item.title}</h4>
        </a>
      );
    }

    if (displayType === "icons") {
      return (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center w-full"
        >
          <div
            className="w-14 h-14 flex items-center justify-center rounded-xl mb-2 transition-transform group-hover:scale-110"
            style={{
              backgroundColor: item.iconType === "image" ? "transparent" : item?.bgColor,
              opacity: item?.opacity,
            }}
          >
            <RowItemIcon item={item} getContrastColor={getContrastColor} />
          </div>
          <h4 className="text-xs font-medium truncate w-full text-center text-gray-700 dark:text-gray-300">
            {item.title}
          </h4>
        </a>
      );
    }

    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        style={{
          backgroundColor: item?.bgColor,
          opacity: item?.opacity,
        }}
      >
        <div className="flex items-center h-full">
          <RowItemIcon item={item} getContrastColor={getContrastColor} />
          <div className={`flex-1 min-w-0 ${item.iconType !== "text" ? "ml-4" : ""}`}>
            <h4
              className="text-base font-medium truncate"
              style={{
                color: item?.bgColor ?
                  getContrastColor(item.bgColor) :
                  'inherit'
              }}
            >
              {item.title}
            </h4>
            <p
              className="text-sm mt-1 truncate text-gray-500 dark:text-gray-400"
              style={{
                color: item?.bgColor ?
                  getContrastColor(item.bgColor, 0.7) :
                  'inherit'
              }}
            >
              {item.description || " "}
            </p>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className={`grid ${displayType === "titles"
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2"
        : displayType === "icons"
          ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4"
      }`}>
      {items.map((item) => (
        <GroupItemContextMenu
          key={item.id}
          item={item}
          groupId={groupId}
          onEdit={onEdit}
          onDelete={onDelete}
        >
          <div
            className={`${displayType === "titles"
                ? "inline-block mr-2 mb-2"
                : displayType === "icons"
                  ? "flex flex-col items-center"
                  : "h-[88px]"
              }`}
          >
            {renderGroupItem(item)}
          </div>
        </GroupItemContextMenu>
      ))}
    </div>
  );
}