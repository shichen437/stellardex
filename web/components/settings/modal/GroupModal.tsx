import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Group } from "@/lib/types/group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface GroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (group: { id?: number; name: string; displayType: Group["displayType"] }) => void;
  initialName?: string;
  initialStyle?: Group["displayType"];
  editing?: boolean;
  editingId?: number;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  open,
  onOpenChange,
  onSave,
  initialName = "",
  initialStyle = "details",
  editing = false,
  editingId,
}) => {
  const [name, setName] = useState(initialName);
  const [style, setStyle] = useState<Group["displayType"]>(initialStyle);
  const { t } = usePolyglot();

  useEffect(() => {
    setName(initialName);
    setStyle(initialStyle);
  }, [initialName, initialStyle, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs w-full rounded-xl shadow-2xl p-8 bg-popover dark:bg-popover">
        <DialogHeader>
          <DialogTitle>{editing ? t("groups.edit") : t("groups.add")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t("groups.groupName")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:border-gray-600"
              placeholder={t("groups.placeholder.groupName")}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t("groups.showType")}</label>
            <Select
              value={style}
              onValueChange={(value) => setStyle(value as Group["displayType"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("groups.placeholder.displayType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="details">{t("groups.showType_detail")}</SelectItem>
                <SelectItem value="icons">{t("groups.showType_icon")}</SelectItem>
                <SelectItem value="titles">{t("groups.showType_title")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={() => {
              if (name.trim()) {
                onSave({ id: editing ? editingId : undefined, name: name.trim(), displayType: style });
              }
            }}
          >
            {editing ? t("common.save") : t("common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};