import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PlusCircle,
  GripVertical,
  Trash2,
  Eye,
  EyeOff,
  LayoutGrid,
  LayoutList,
  Edit,
} from "lucide-react";
import type { SettingsState } from "@/lib/types/settings";
import type { Group } from "@/lib/types/group";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { GroupModal } from "@/components/settings/modal/GroupModal";
import { DeleteGroupModal } from "@/components/settings/modal/DeleteGroupModal";
import {
  addGroup,
  updateGroup,
  deleteGroup,
  sortGroup,
  visiableGroup,
} from "@/api/group";
import { useGroupStore } from "@/lib/store/group";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface GroupsTabProps {
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}

function SortableGroupItem({
  group,
  onDelete,
  onToggleVisibility,
  onEdit,
}: {
  group: Group;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number) => void;
  onEdit: (group: Group) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: group.id });
  const { t } = usePolyglot();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-black/50"
    >
      <TableCell>
        <div {...attributes} {...listeners}>
          <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
        </div>
      </TableCell>
      <TableCell className="w-full">
        <div className="flex-1 text-left truncate">
          <span className="font-medium">{group.groupName}</span>
          <span className="ml-2 text-sm text-gray-500">
            {group.displayType === "details" && t("groups.showType_detail")}
            {group.displayType === "icons" && t("groups.showType_icon")}
            {group.displayType === "titles" && t("groups.showType_title")}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit(group)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleVisibility(group.id)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700"
          >
            {group.isShow ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onDelete(group.id)}
            className="p-2 rounded-lg text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function GroupsTab({ settings, onSettingsChange }: GroupsTabProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDeleteGroupId, setPendingDeleteGroupId] = useState<
    number | null
  >(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [modalInitialName, setModalInitialName] = useState("");
  const [modalInitialStyle, setModalInitialStyle] =
    useState<Group["displayType"]>("details");
  const groups = useGroupStore((state) => state.groups);
  const fetchGroups = useGroupStore((state) => state.fetchGroups);
  const { t } = usePolyglot();
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleDeleteGroup = (groupId: number) => {
    setPendingDeleteGroupId(groupId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (pendingDeleteGroupId) {
      await deleteGroup(Number(pendingDeleteGroupId));
      await handleGroupsChange();
      setPendingDeleteGroupId(null);
      setDeleteModalOpen(false);
    }
  };

  const toggleGroupVisibility = async (groupId: number) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    await visiableGroup({
      id: Number(groupId),
      isShow: group.isShow ? 0 : 1,
    });
    await handleGroupsChange();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = groups.findIndex((item) => item.id === active.id);
      const newIndex = groups.findIndex((item) => item.id === over.id);
      const newGroups = arrayMove(groups, oldIndex, newIndex);
      const sortData = newGroups.map((g, idx) => ({
        id: Number(g.id),
        orderNum: idx + 1,
      }));
      await sortGroup({ groups: sortData });
      await handleGroupsChange();
    }
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setModalInitialName(group.groupName);
    setModalInitialStyle(group.displayType);
    setModalOpen(true);
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setModalInitialName("");
    setModalInitialStyle("details");
    setModalOpen(true);
  };

  const handleSaveGroup = async (data: {
    id?: number;
    name: string;
    displayType: Group["displayType"];
  }) => {
    if (editingGroup) {
      await updateGroup({
        id: editingGroup.id,
        name: data.name,
        displayType: data.displayType,
      });
    } else {
      await addGroup({
        name: data.name,
        displayType: data.displayType,
      });
    }
    await useGroupStore.getState().fetchGroups(true);
    setModalOpen(false);
    setEditingGroup(null);
  };

  const handleGroupsChange = async () => {
    await useGroupStore.getState().fetchGroups(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{t("groups.list")}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              onSettingsChange({
                ...settings,
                groupConfig: { ...settings.groupConfig, groupLayout: "grid" },
              })
            }
            className={`p-2 rounded-lg transition-colors ${
              settings.groupConfig.groupLayout === "grid"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            title={t("groups.grid")}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <button
            onClick={() =>
              onSettingsChange({
                ...settings,
                groupConfig: { ...settings.groupConfig, groupLayout: "row" },
              })
            }
            className={`p-2 rounded-lg transition-colors ${
              settings.groupConfig.groupLayout === "row"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            title={t("groups.row")}
          >
            <LayoutList className="w-5 h-5" />
          </button>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <button
            onClick={handleAddGroup}
            className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`}
            title={t("groups.add")}
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={groups.map((g) => g.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="overflow-y-auto overflow-x-hidden h-full">
              <Table className="relative w-full">
                <TableBody>
                  {groups.map((group) => (
                    <SortableGroupItem
                      key={group.id}
                      group={group}
                      onDelete={handleDeleteGroup}
                      onToggleVisibility={toggleGroupVisibility}
                      onEdit={handleEditGroup}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* 添加/编辑分组的弹出框 */}
      <GroupModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingGroup(null);
        }}
        onSave={handleSaveGroup}
        initialName={modalInitialName}
        initialStyle={modalInitialStyle}
        editing={!!editingGroup}
        editingId={editingGroup?.id}
      />
      <DeleteGroupModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) setPendingDeleteGroupId(null);
        }}
        onConfirm={confirmDeleteGroup}
      />
    </div>
  );
}
