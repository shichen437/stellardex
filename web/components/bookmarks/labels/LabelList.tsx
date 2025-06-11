import { Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type UserBmLabel } from "@/lib/types/bookmark";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { LabelCard } from "./LabelCard";

interface Props {
  labels: UserBmLabel[];
  onAdd: () => void;
  onEdit: (label: UserBmLabel) => void;
  onDelete: (id: number) => void;
}

export function LabelList({ labels, onAdd, onEdit, onDelete }: Props) {
  const { t } = usePolyglot();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">{t("bookmark.label.title")}</h2>
        <Button onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          {t("bookmark.label.add")}
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {labels && labels.length > 0 ? (
          labels.map((label) => (
            <LabelCard
              key={label.id}
              label={label}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Tag className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium mb-2">{t("bookmark.empty.label.title")}</p>
            <p className="text-sm text-gray-400">{t("bookmark.empty.label.description")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
