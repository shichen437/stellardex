import { LabelList } from "../labels/LabelList";
import { LabelDialog } from "../labels/LabelDialog";
import { CommonConfirmDialog } from "@/components/common/CommonConfirmDialog";
import { type UserBmLabel } from "@/lib/types/bookmark";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getUserBmLabels,
  saveUserBmLabel,
  updateUserBmLabel,
  deleteUserBmLabel,
} from "@/api/bookmark/bookmark_label";

interface Props {
  onUpdateBookmarkNum: () => void;
  onLabelClick: (label: UserBmLabel) => void;
}

export function TagsView({ onUpdateBookmarkNum, onLabelClick }: Props) {
  const { t } = usePolyglot();
  const [labels, setLabels] = useState<UserBmLabel[]>([]);
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [labelFormData, setLabelFormData] = useState({
    id: 0,
    name: "",
  });
  const [deletingLabelId, setDeletingLabelId] = useState<number | null>(null);
  const [labelDeleteModalOpen, setLabelDeleteModalOpen] = useState(false);
  useEffect(() => {
    fetchLabels();
  });

  const handleAdd = () => {
    setLabelModalOpen(true);
  };

  const handleEdit = (label: UserBmLabel) => {
    setLabelFormData(label);
    setLabelModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingLabelId(id);
    setLabelDeleteModalOpen(true);
  };

  const fetchLabels = async () => {
    try {
      const res = await getUserBmLabels();
      if (res.code === 0) {
        setLabels(res.data.rows);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLabelSubmit = async (labelFormData: {
    id: number;
    name: string;
  }) => {
    console.log(labelFormData.name);
    if (!labelFormData.name.trim()) {
      toast.error(t("bookmark.label.valid.name"));
      return;
    }
    try {
      const res =
        labelFormData.id > 0
          ? await updateUserBmLabel(labelFormData)
          : await saveUserBmLabel({ name: labelFormData.name });

      if (res.code === 0) {
        toast.success(t("toast.success"));
        fetchLabels();
        setLabelModalOpen(false);
        setLabelFormData({ id: 0, name: "" });
        if (labelFormData.id > 0) {
          onUpdateBookmarkNum();
        }
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLabelDelete = async () => {
    if (deletingLabelId) {
      try {
        const res = await deleteUserBmLabel(deletingLabelId);
        if (res.code === 0) {
          toast.success(t("toast.success"));
          fetchLabels();
          onUpdateBookmarkNum();
        } else {
          toast.error(res.msg);
        }
      } catch (error) {
        console.log(error);
      }
      setLabelDeleteModalOpen(false);
      setDeletingLabelId(null);
    }
  };

  return (
    <div>
      <LabelList
        labels={labels}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onLabelClick={onLabelClick}
      />

      <LabelDialog
        open={labelModalOpen}
        onOpenChange={setLabelModalOpen}
        data={labelFormData}
        onSubmit={handleLabelSubmit}
      />

      <CommonConfirmDialog
        open={labelDeleteModalOpen}
        onOpenChange={setLabelDeleteModalOpen}
        onConfirm={handleLabelDelete}
        title={t("bookmark.label.delete")}
        description={t("bookmark.label.deleteMessage")}
      />
    </div>
  );
}
