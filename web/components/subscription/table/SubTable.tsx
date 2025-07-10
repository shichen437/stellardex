import { Edit, Trash2, Circle, Ban } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { usePolyglot } from "@/providers/PolyglotProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { type Subscription } from "@/lib/types/subscription";

interface Props {
  subs: Subscription[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: number) => void;
  onEnable: (id: number) => Promise<void>;
  onDisable: (id: number) => Promise<void>;
  onRefresh: () => void;
}

export function SubTable({
  subs,
  onEdit,
  onDelete,
  onEnable,
  onDisable,
  onRefresh,
}: Props) {
  const { t } = usePolyglot();

  const handleEnable = async (id: number) => {
    await onEnable(id);
    onRefresh();
  };

  const handleDisable = async (id: number) => {
    await onDisable(id);
    onRefresh();
  };

  const getCycleTypeText = (type: number, num: number) => {
    switch (type) {
      case 0:
        return t("subscription.cycle.forever");
      case 1:
        if (num <= 1) return t("subscription.cycle.yearly");
        return `${num} ${t("subscription.cycle.years")}`;
      case 2:
        if (num <= 1) return t("subscription.cycle.quarterly");
        return `${num} ${t("subscription.cycle.quarters")}`;
      case 3:
        if (num <= 1) return t("subscription.cycle.monthly");
        return `${num} ${t("subscription.cycle.months")}`;
      case 4:
        if (num <= 1) return t("subscription.cycle.weekly");
        return `${num} ${t("subscription.cycle.weeks")}`;
      default:
        return "";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8 text-center"></TableHead>
          <TableHead className="w-30 text-center">
            {t("subscription.field.title")}
          </TableHead>
          <TableHead className="w-20 text-center">
            {t("subscription.field.cycle")}
          </TableHead>
          <TableHead className="w-30 text-center">
            {t("subscription.field.startDate")}
          </TableHead>
          <TableHead className="w-30 text-center">
            {t("subscription.field.nextDate")}
          </TableHead>
          <TableHead className="w-20 text-center">
            {t("subscription.field.amount")}
          </TableHead>
          <TableHead className="w-[15%] text-center">
            {t("subscription.field.category")}
          </TableHead>
          <TableHead className="w-[15%] text-center">
            {t("subscription.field.site")}
          </TableHead>
          <TableHead className="w-32 text-center py-3">
            {t("common.options")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subs.map((sub) => (
          <TableRow key={sub.id}>
            <TableCell className="text-center">
              {" "}
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full inline-block",
                  sub.status === 1 ? "bg-teal-500" : "bg-slate-400"
                )}
              />
            </TableCell>
            <TableCell className="text-center">{sub.title}</TableCell>
            <TableCell className="text-center">
              {getCycleTypeText(sub.cycleType, sub.cycleNum)}
            </TableCell>
            <TableCell className="text-center">
              {formatDate(sub.startDate, t("common.dateFormat"))}
            </TableCell>
            <TableCell className="text-center">
              {formatDate(sub.nextDate, t("common.dateFormat"))}
            </TableCell>
            <TableCell className="text-center">
              {sub.currencySymbol}
              {sub.amount}
            </TableCell>
            <TableCell className="text-center">{sub.category}</TableCell>
            <TableCell className="text-center">
              {sub.site && (
                <a
                  href={sub.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {sub.site}
                </a>
              )}
            </TableCell>
            <TableCell className="text-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(sub)}
                title={t("common.edit")}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(sub.id)}
                title={t("common.delete")}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {sub.status === 1 ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDisable(sub.id)}
                  title={t("subscription.disable")}
                  className="text-destructive hover:text-destructive"
                >
                  <Ban className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEnable(sub.id)}
                  title={t("subscription.enable")}
                >
                  <Circle className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
