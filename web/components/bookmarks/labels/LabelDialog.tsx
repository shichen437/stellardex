import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: { id: number; name: string };
  onSubmit: (data: { id: number; name: string }) => void;
}

export function LabelDialog({ open, onOpenChange, data, onSubmit }: Props) {
  const { t } = usePolyglot();
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data.id > 0 ? t("bookmark.label.edit") : t("bookmark.label.add")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t("bookmark.label.name")}
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={localData.name}
              onChange={(e) => setLocalData({...localData, name: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={() => onSubmit(localData)}>{t("common.confirm")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
