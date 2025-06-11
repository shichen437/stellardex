import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { type Selector } from "@/lib/types/bookmark";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface SelectorTableProps {
  selectors: Selector[];
  onEdit: (selector: Selector) => void;
  onDelete: (id: number) => void;
}

export function SelectorTable({ selectors, onEdit, onDelete }: SelectorTableProps) {
  const { t } = usePolyglot();
  return (
    <div className="rounded-md border max-w-[1200px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] text-center font-medium">{t("bookmark.selector.fields.domain")}</TableHead>
            <TableHead className="w-[250px] text-center font-medium">{t("bookmark.selector.fields.title")}</TableHead>
            <TableHead className="w-[250px] text-center font-medium">{t("bookmark.selector.fields.content")}</TableHead>
            <TableHead className="w-[400px] text-center font-medium">Cookie</TableHead>
            <TableHead className="w-[100px] text-center font-medium">{t("common.options")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectors.map((selector) => (
            <TableRow key={selector.id} className="h-14">
              <TableCell>
                <div className="max-w-[200px] px-2 text-center">
                  <span className="inline-block truncate w-full" title={selector.domain}>
                    {selector.domain}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[250px] px-2 text-center">
                  <span className="inline-block truncate w-full" title={selector.title}>
                    {selector.title || '-'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[250px] px-2 text-center">
                  <span className="inline-block truncate w-full" title={selector.content}>
                    {selector.content || '-'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[400px] px-2 text-center">
                  <span className="inline-block truncate w-full" title={selector.cookie}>
                    {selector.cookie || '-'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(selector)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(selector.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}