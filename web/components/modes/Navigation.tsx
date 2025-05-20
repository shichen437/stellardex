import { useState, useEffect } from "react";
import { Settings, Plus } from "lucide-react";
import { SearchBar } from "@/components/modes/module/SearchBar";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { GroupItemModal } from "@/components/modes/modal/GroupItemModal";
import { DateTime } from "@/components/modes/module/DateTime";
import { Meteors } from "@/components/magicui/meteors";
import { SEARCH_ENGINE_LOGO } from "@/lib/search";
import type { SettingsState } from "@/lib/types/settings";
import type { GroupItem } from "@/lib/types/group";
import { useGroupStore } from "@/lib/store/group";
import { GroupItemList } from "./common/GroupItemList";
import { useGroupItemContextMenu } from "@/hooks/useGroupItemContextMenu";
import { useSettingsStore } from "@/lib/store/settings";
import {
  allGroupItems,
  addGroupItem,
  deleteGroupItem,
  updateGroupItem,
} from "@/api/group_item";

export function NavigationModeView() {
  const [showSettings, setShowSettings] = useState(false);
  const [showGroupItemModal, setShowGroupItemModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [editingGroupItem, setEditingGroupItem] = useState<GroupItem | null>(
    null
  );
  const [groupItemsMap, setGroupItemsMap] = useState<
    Record<number, GroupItem[]>
  >({});
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const { contextMenu, setContextMenu, handleContextMenu } =
    useGroupItemContextMenu();
  const groupList = useGroupStore((state) => state.groups);
  const fetchGroups = useGroupStore((state) => state.fetchGroups);

  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const handleSettingsChange = (newSettings: SettingsState) => {
    updateSettings(newSettings);
  };

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (selectedGroupId) {
      allGroupItems(selectedGroupId).then((res) => {
        setGroupItemsMap((prev) => ({
          ...prev,
          [selectedGroupId]: res.data?.rows || [],
        }));
      });
    }
  }, [selectedGroupId]);

  useEffect(() => {
    async function fetchAllGroupItems() {
      const itemsMap: Record<number, GroupItem[]> = {};
      await Promise.all(
        groupList.map(async (group) => {
          if (group.isShow) {
            const res = await allGroupItems(group.id);
            itemsMap[group.id] = res.data?.rows || [];
          }
        })
      );
      setGroupItemsMap(itemsMap);
    }
    if (groupList.length > 0) {
      fetchAllGroupItems();
    }
  }, [groupList]);

  const handleAddGroupItem = async (groupId: number, item: GroupItem) => {
    await addGroupItem({ ...item, groupId });
    const res = await allGroupItems(groupId);
    setGroupItemsMap((prev) => ({
      ...prev,
      [groupId]: res.data?.rows || [],
    }));
    setShowGroupItemModal(false);
  };

  const handleUpdateGroupItem = async (groupId: number, item: GroupItem) => {
    await updateGroupItem({ ...item, groupId });
    const res = await allGroupItems(groupId);
    setGroupItemsMap((prev) => ({
      ...prev,
      [groupId]: res.data?.rows || [],
    }));
    setShowGroupItemModal(false);
    setEditingGroupItem(null);
  };

  const handleEditGroupItem = async (groupId: number, itemId: number) => {
    const item = groupItemsMap[groupId]?.find((w) => w.id === itemId);
    if (item) {
      setEditingGroupItem(item);
      setSelectedGroupId(groupId);
      setShowGroupItemModal(true);
    }
  };

  const handleDeleteGroupItem = async (groupId: number, itemId: number) => {
    await deleteGroupItem(itemId);
    const res = await allGroupItems(groupId);
    setGroupItemsMap((prev) => ({
      ...prev,
      [groupId]: res.data?.rows || [],
    }));
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {settings.moduleConfig?.showMeteors && (
        <Meteors number={20} minDuration={2.5} maxDuration={10} />
      )}

      <div className="fixed top-4 right-4 z-50">
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {showSettings && settings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div className="flex flex-col items-center justify-start pt-12 px-4 space-y-12 pb-12 flex-grow">
        {(settings.moduleConfig?.showClock ||
          settings.moduleConfig?.showCalendar) && (
          <DateTime
            language={settings.interfaceConfig?.language}
            showClock={settings.moduleConfig?.showClock}
            showCalendar={settings.moduleConfig?.showCalendar}
            calendarFormat={settings.moduleConfig?.calendarFormat}
          />
        )}

        {settings.moduleConfig?.showSearchBar && (
          <SearchBar
            searchEngine={settings.moduleConfig?.searchEngine}
            searchEngineLogo={SEARCH_ENGINE_LOGO}
          />
        )}

        <div
          className={`w-full max-w-6xl ${
            settings.groupConfig?.groupLayout === "grid"
              ? "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
              : "space-y-6"
          }`}
        >
          {!mounted ? null : groupList.length === 0 ? (
            <div className="col-span-full text-center py-12 break-inside-avoid">
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">
                还没有添加任何分组
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-500">
                点击右上角设置按钮添加分组
              </p>
            </div>
          ) : (
            groupList
              .filter((group) => group.isShow)
              .map((group) => (
                <div key={group.id} className="p-4 group break-inside-avoid">
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-medium">{group.groupName}</h3>
                    <button
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        setShowGroupItemModal(true);
                      }}
                      className="ml-2 p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <GroupItemList
                    items={groupItemsMap[group.id] || []}
                    displayType={group.displayType}
                    groupLayout={settings.groupConfig?.groupLayout || "row"}
                    onContextMenu={handleContextMenu}
                    groupId={group.id}
                    contextMenu={contextMenu}
                    onEdit={(item) => handleEditGroupItem(item.groupId, item.id)}
                    onDelete={(item) => handleDeleteGroupItem(item.groupId, item.id)}
                    setContextMenu={setContextMenu}
                  />
                </div>
              ))
          )}
        </div>
      </div>

      {mounted && settings.siteConfig?.siteFooter && (
        <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          {settings.siteConfig.siteFooter}
        </footer>
      )}

      {showGroupItemModal && selectedGroupId && (
        <GroupItemModal
          currentGroupId={selectedGroupId}
          item={editingGroupItem}
          onClose={() => {
            setShowGroupItemModal(false);
            setSelectedGroupId(null);
            setEditingGroupItem(null);
          }}
          onSubmit={(item) => {
            if (editingGroupItem) {
              handleUpdateGroupItem(selectedGroupId, {
                ...editingGroupItem,
                ...item,
              });
            } else {
              handleAddGroupItem(selectedGroupId, item);
            }
          }}
        />
      )}
    </div>
  );
}
