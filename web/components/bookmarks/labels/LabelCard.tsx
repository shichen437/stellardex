import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";
import { type UserBmLabel } from "@/lib/types/bookmark";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface Props {
  label: UserBmLabel;
  onEdit: (label: UserBmLabel) => void;
  onDelete: (id: number) => void;
  onClick: (label: UserBmLabel) => void;
}

export function LabelCard({ label, onEdit, onDelete, onClick }: Props) {
  const { t } = usePolyglot();

  return (
    <Card
      className="p-6 hover:shadow-lg transition-shadow"
      onClick={() => onClick(label)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{label.name}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {label.bmNum} {t("bookmark.label.count")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onEdit(label);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDelete(label.id);
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
