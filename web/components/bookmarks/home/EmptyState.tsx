import { Inbox } from "lucide-react";
import { usePolyglot } from "@/providers/PolyglotProvider";

export function EmptyState({ status, group }: { status?: number; group?: string }) {
    const { t } = usePolyglot();
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Inbox className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium mb-2">
          {group === "archive" ? t("bookmark.empty.archive.title") : ""}
          {group === "starred" ? t("bookmark.empty.starred.title") : ""}
          {group === "status"
            ? t(`bookmark.empty.${status === undefined ? "all" : status}.title`)
            : ""}
        </p>
        <p className="text-sm text-gray-400">
          {group === "archive" ? t("bookmark.empty.archive.description") : ""}
          {group === "starred" ? t("bookmark.empty.starred.description") : ""}
          {group === "status"
            ? t(
                `bookmark.empty.${
                  status === undefined ? "all" : status
                }.description`
              )
            : ""}
        </p>
      </div>
    );
  }