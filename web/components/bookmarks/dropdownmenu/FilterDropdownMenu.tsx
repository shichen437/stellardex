import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { SearchParams } from "@/lib/types/bookmark";

interface Props {
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function FilterDropdownMenu({
  searchParams,
  onSearchParamsChange,
  onSearch,
  onReset,
}: Props) {
  const { t } = usePolyglot();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("common.keyword")}</label>
            <Input
              placeholder={t("bookmark.placeholder.keyword")}
              value={searchParams.keyword}
              onChange={(e) =>
                onSearchParamsChange({
                  ...searchParams,
                  keyword: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("bookmark.fields.byline")}
            </label>
            <Input
              placeholder={t("bookmark.placeholder.byline")}
              value={searchParams.author}
              onChange={(e) =>
                onSearchParamsChange({
                  ...searchParams,
                  author: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("bookmark.fields.site")}
            </label>
            <Input
              placeholder={t("bookmark.placeholder.site")}
              value={searchParams.site}
              onChange={(e) =>
                onSearchParamsChange({
                  ...searchParams,
                  site: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("bookmark.label.title")}
            </label>
            <Input
              placeholder={t("bookmark.placeholder.label")}
              value={searchParams.label}
              onChange={(e) =>
                onSearchParamsChange({
                  ...searchParams,
                  label: e.target.value,
                })
              }
            />
          </div>
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={onReset}
            >
              {t("common.reset")}
            </Button>
            <Button className="flex-1" onClick={onSearch}>
              {t("common.search")}
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
