import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface SearchParams {
  keyword: string;
  author: string;
  site: string;
  title: string;
}

interface Props {
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  onSearch: () => void;
}

export function FilterDropdownMenu({
  searchParams,
  onSearchParamsChange,
  onSearch,
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
            <label className="text-sm font-medium">{t("bookmark.fields.byline")}</label>
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
            <label className="text-sm font-medium">{t("bookmark.fields.site")}</label>
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
            <label className="text-sm font-medium">{t("bookmark.fields.title")}</label>
            <Input
              placeholder={t("bookmark.placeholder.title")}
              value={searchParams.title}
              onChange={(e) =>
                onSearchParamsChange({
                  ...searchParams,
                  title: e.target.value,
                })
              }
            />
          </div>
          <Button className="w-full" onClick={onSearch}>
            {t("common.search")}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
