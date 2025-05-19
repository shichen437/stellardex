import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { SearchBar } from "@/components/modes/module/SearchBar";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { GroupItemModal } from "@/components/modes/modal/GroupItemModal";
import { DateTime } from "@/components/modes/module/DateTime";
import { SEARCH_ENGINE_LOGO } from "@/lib/search";
import { Meteors } from "@/components/magicui/meteors";
import type { SettingsState } from "@/lib/types/settings";
import type { GroupItem } from "@/lib/types/group";
import { GroupNavigation } from "@/components/modes/module/GroupNavigation";
import { GroupItemGrid } from "@/components/modes/common/GroupItemGrid";
import { useGroupItemContextMenu } from "@/hooks/useGroupItemContextMenu";
import { useGroupStore } from "@/lib/store/group";
import {
  allGroupItems,
  addGroupItem,
  updateGroupItem,
  deleteGroupItem,
} from "@/api/group_item";
import { useSettingsStore } from "@/lib/store/settings";

export function HomepageModeView() {
  const [showSettings, setShowSettings] = useState(false);
  const [showGroupItemModal, setShowGroupItemModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [editingGroupItem, setEditingGroupItem] = useState<GroupItem | null>(
    null
  );
  const [groupItems, setGroupItems] = useState<GroupItem[]>([]);
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
    <div className="min-h-screen w-full relative flex flex-col">
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
        {mounted && (
          <div className="fixed top-4 right-4 z-50">
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        )}

        <div className="flex flex-col items-center justify-start pt-12 px-4 space-y-12 pb-12 flex-grow">
          {mounted &&
            (settings.moduleConfig.showClock ||
              settings.moduleConfig.showCalendar) && (
              <DateTime
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
                onDelete={(item) => handleDeleteGroupItem(item.groupId, item.id)}
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

      {/* Modals */}
      {showSettings && settings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
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
