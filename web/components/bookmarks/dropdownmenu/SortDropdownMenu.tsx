import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  ArrowUpAZ,
  ArrowDownZA,
  ArrowUp01,
  ArrowDown10,
} from "lucide-react";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface Props {
  sort: string;
  onSortChange: (sort: string) => void;
}

export function SortDropdownMenu({ sort, onSortChange }: Props) {
  const { t } = usePolyglot();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onSortChange("")}
          className={cn(sort === "" && "bg-accent")}
        >
          <ArrowDownNarrowWide className="w-4 h-4" />
          {t("bookmark.sort.latest")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSortChange("id:asc")}
          className={cn(sort === "id:asc" && "bg-accent")}
        >
          <ArrowUpNarrowWide className="w-4 h-4" />
          {t("bookmark.sort.earliest")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSortChange("siteName:desc")}
          className={cn(sort === "siteName:desc" && "bg-accent")}
        >
          <ArrowDownZA className="w-4 h-4" />
          {t("bookmark.sort.site")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSortChange("siteName:asc")}
          className={cn(sort === "siteName:asc" && "bg-accent")}
        >
          <ArrowUpAZ className="w-4 h-4" />
          {t("bookmark.sort.site")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSortChange("readingTime:desc")}
          className={cn(sort === "readingTime:desc" && "bg-accent")}
        >
          <ArrowDown10 className="w-4 h-4" />
          {t("bookmark.sort.readingTime")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSortChange("readingTime:asc")}
          className={cn(sort === "readingTime:asc" && "bg-accent")}
        >
          <ArrowUp01 className="w-4 h-4" />
          {t("bookmark.sort.readingTime")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
