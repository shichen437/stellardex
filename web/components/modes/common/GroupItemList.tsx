import { RowItemIcon } from "./RowItemIcon";
import { getContrastColor } from "../../../lib/utils";
import type { GroupItem } from "@/lib/types/group";
import { GroupItemContextMenu } from "../context/GroupItemContextMenu";

interface GroupItemListProps {
  items: GroupItem[];
  displayType: string;
  groupLayout: string;
  onContextMenu: (
    e: React.MouseEvent,
    item: GroupItem,
    groupId: number
  ) => void;
  groupId: number;
  contextMenu: { item: GroupItem; groupId: number } | null;
  onEdit: (item: GroupItem) => void;
  onDelete: (item: GroupItem) => void;
  setContextMenu: (value: null) => void;
}

export function GroupItemList({
  items,
  displayType,
  groupLayout,
  groupId,
  onEdit,
  onDelete,
}: GroupItemListProps) {
  if (displayType === "titles") {
    return (
      <div className="space-y-2">
        {items.map((item) => (
          <GroupItemContextMenu
            item={item}
            groupId={groupId}
            key={item.id}
            onEdit={onEdit}
            onDelete={onDelete}
          >
            <div className="inline-block mr-4 mb-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:text-blue-600 border-b border-dashed border-gray-200 dark:border-gray-700"
              >
                <h4 className="text-base font-medium">{item.title}</h4>
              </a>
            </div>
          </GroupItemContextMenu>
        ))}
      </div>
    );
  }

  if (displayType === "icons") {
    return (
      <div
        className={`${
          groupLayout === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8"
            : "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6"
        }`}
      >
        {items.map((item) => (
          <GroupItemContextMenu
            item={item}
            groupId={groupId}
            key={item.id}
            onEdit={onEdit}
            onDelete={onDelete}
          >
            <div key={item.id} className="relative">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center hover:opacity-80 transition-opacity"
                style={{ opacity: item?.opacity }}
              >
                <div
                  className={`${
                    groupLayout === "grid" ? "w-16 h-16" : "w-14 h-14"
                  } flex items-center justify-center rounded-xl mb-3`}
                  style={{
                    backgroundColor:
                      item.iconType === "image" ? "transparent" : item?.bgColor,
                  }}
                >
                  <RowItemIcon
                    item={item}
                    getContrastColor={getContrastColor}
                  />
                </div>
                <h4
                  className={`${
                    groupLayout === "grid" ? "text-sm" : "text-xs"
                  } font-medium truncate w-full text-center px-2`}
                >
                  {item.title}
                </h4>
              </a>
            </div>
          </GroupItemContextMenu>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${
        groupLayout === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
      }`}
    >
      {items.map((item) => (
        <GroupItemContextMenu
          item={item}
          groupId={groupId}
          key={item.id}
          onEdit={onEdit}
          onDelete={onDelete}
        >
          <div
            key={item.id}
            className={`relative ${
              groupLayout === "grid" ? "h-[88px]" : "h-[72px]"
            }`}
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              style={{
                backgroundColor: item?.bgColor,
                opacity: item?.opacity,
              }}
            >
              <RowItemIcon item={item} getContrastColor={getContrastColor} />
              <div
                className={`flex-1 min-w-0 ${
                  item.iconType !== "text" ? "ml-4" : ""
                }`}
              >
                <h4
                  className="text-base font-medium truncate"
                  style={{
                    color: item?.bgColor
                      ? getContrastColor(item.bgColor)
                      : "inherit",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  className="text-sm mt-1 truncate"
                  style={{
                    color: item?.bgColor
                      ? getContrastColor(item.bgColor, 0.7)
                      : "inherit",
                  }}
                >
                  {item.description || " "}
                </p>
              </div>
            </a>
          </div>
        </GroupItemContextMenu>
      ))}
    </div>
  );
}
