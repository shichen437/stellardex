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

  useEffect(() => {
    setName(initialName);
    setStyle(initialStyle);
  }, [initialName, initialStyle, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs w-full rounded-xl shadow-2xl p-8 bg-popover dark:bg-popover">
        <DialogHeader>
          <DialogTitle>{editing ? "编辑分组" : "添加分组"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">分组名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:border-gray-600"
              placeholder="请输入分组名称"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">显示样式</label>
            <Select
              value={style}
              onValueChange={(value) => setStyle(value as Group["displayType"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择显示样式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="details">详情</SelectItem>
                <SelectItem value="icons">图标</SelectItem>
                <SelectItem value="titles">标题</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              if (name.trim()) {
                onSave({ id: editing ? editingId : undefined, name: name.trim(), displayType: style });
              }
            }}
          >
            {editing ? "保存" : "确定"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};