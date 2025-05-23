import { useState, useEffect } from "react";
import { Meteors } from "@/components/magicui/meteors";
import { SearchBar } from "@/components/modes/module/SearchBar";
import { DateTime } from "@/components/modes/module/DateTime";
import { GroupItemModal } from "@/components/modes/modal/GroupItemModal";
import { GroupNavigation } from "@/components/modes/module/GroupNavigation";
import { GroupItemGrid } from "@/components/modes/common/GroupItemGrid";
import { SEARCH_ENGINE_LOGO } from "@/lib/search";
import type { GroupItem } from "@/lib/types/group";
import { useGroupItemContextMenu } from "@/hooks/useGroupItemContextMenu";
import { useSettingsStore } from "@/lib/store/settings";
import { useGroupStore } from "@/lib/store/group";
import {
  allGroupItems,
  addGroupItem,
  updateGroupItem,
  deleteGroupItem,
} from "@/api/group_item";

export function HomepageModeView() {
  const [showGroupItemModal, setShowGroupItemModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [editingGroupItem, setEditingGroupItem] = useState<GroupItem | null>(
    null
  );
  const [groupItems, setGroupItems] = useState<GroupItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const groupList = useGroupStore((state) => state.groups);
  const fetchGroups = useGroupStore((state) => state.fetchGroups);

  const settings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { contextMenu, setContextMenu, handleContextMenu } =
    useGroupItemContextMenu();

  useEffect(() => {
    fetchGroups();
    if (selectedGroupId) {
      allGroupItems(selectedGroupId || 0).then((res) => {
        setGroupItems(res.data?.rows || []);
      });
    }
  }, [selectedGroupId, fetchGroups]);

  useEffect(() => {
    if (groupList.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groupList[0].id);
    }
  }, [groupList, selectedGroupId]);

  const handleAddGroupItem = async (groupId: number, item: GroupItem) => {
    await addGroupItem({ ...item, groupId });
    const res = await allGroupItems(groupId);
    setGroupItems(res.data?.rows || []);
    setShowGroupItemModal(false);
  };

  const handleEditGroupItem = async (item: GroupItem) => {
    await updateGroupItem(item);
    const res = await allGroupItems(item.groupId);
    setGroupItems(res.data?.rows || []);
    setShowGroupItemModal(false);
  };

  const handleDeleteGroupItem = async (groupId: number, itemId: number) => {
    await deleteGroupItem(itemId);
    const res = await allGroupItems(groupId);
    setGroupItems(res.data?.rows || []);
  };

  const currentGroup = groupList.find((group) => group.id === selectedGroupId);

  return (
    <div className="min-h-screen w-full relative flex flex-col overflow-x-hidden">
      {settings.moduleConfig?.showMeteors && (
        <Meteors number={20} minDuration={2.5} maxDuration={10} />
      )}

      {mounted && (
        <GroupNavigation
          groups={groupList}
          selectedGroupId={selectedGroupId}
          onGroupSelect={setSelectedGroupId}
          onAddGroupItem={(groupId) => {
            setSelectedGroupId(groupId);
            setShowGroupItemModal(true);
          }}
        />
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex flex-col items-center justify-start pt-12 px-4 space-y-12 pb-12 flex-grow">
          {mounted &&
            (settings.moduleConfig.showClock ||
              settings.moduleConfig.showCalendar) && (
              <DateTime
                language={settings.interfaceConfig?.language}
                showClock={settings.moduleConfig.showClock}
                showCalendar={settings.moduleConfig.showCalendar}
                calendarFormat={settings.moduleConfig.calendarFormat}
              />
            )}

          {mounted && settings.moduleConfig.showSearchBar && (
            <SearchBar
              searchEngine={settings.moduleConfig.searchEngine}
              searchEngineLogo={SEARCH_ENGINE_LOGO}
            />
          )}

          {mounted && currentGroup && (
            <div className="w-full max-w-6xl">
              <GroupItemGrid
                items={groupItems || []}
                displayType={currentGroup.displayType}
                groupId={currentGroup.id}
                onContextMenu={handleContextMenu}
                contextMenu={contextMenu}
                onEdit={(item) => {
                  setEditingGroupItem(item);
                  setShowGroupItemModal(true);
                }}
                onDelete={(item) =>
                  handleDeleteGroupItem(item.groupId, item.id)
                }
                setContextMenu={setContextMenu}
              />
            </div>
          )}
        </div>

        {mounted && settings.siteConfig.siteFooter && (
          <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
            {settings.siteConfig.siteFooter}
          </footer>
        )}
      </div>


      {showGroupItemModal && selectedGroupId && (
        <GroupItemModal
          currentGroupId={selectedGroupId}
          item={editingGroupItem}
          onClose={() => {
            setShowGroupItemModal(false);
            setSelectedGroupId(null);
            setEditingGroupItem(null);
          }}
          onSubmit={
            editingGroupItem
              ? handleEditGroupItem
              : (item) => handleAddGroupItem(selectedGroupId, item)
          }
        />
      )}
    </div>
  );
}
