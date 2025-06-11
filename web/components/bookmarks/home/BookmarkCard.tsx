import { Archive, Star, SquareArrowOutUpRight, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Bookmark } from "@/lib/types/bookmark";
import { usePolyglot } from "@/providers/PolyglotProvider";
export function BookmarkCard({
  bookmark,
  viewMode,
  onDelete,
  onUpdateStatus,
}: {
  bookmark: Bookmark;
  viewMode: "grid" | "list";
  onDelete: (bookmark: Bookmark) => void;
  onUpdateStatus: (data: { id: number; status: number; type: number }) => void;
}) {
  const {t} = usePolyglot();
  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStatus({
      id: bookmark.id,
      status: bookmark.isArchive ? 0 : 1,
      type: 1,
    });
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStatus({
      id: bookmark.id,
      status: bookmark.isStarred ? 0 : 1,
      type: 2,
    });
  };
  return (
    <Card
      className={`hover:shadow-lg transition-shadow cursor-pointer overflow-hidden ${
        viewMode === "grid"
          ? "flex flex-col p-0 gap-0"
          : "flex flex-row p-4 gap-4"
      }`}
      onClick={() => window.open(`/bookmark/${bookmark.id}`, "_blank")}
    >
      <div
        className={`bg-cover bg-center ${
          viewMode === "grid" ? "w-full h-36" : "w-48 h-32"
        }`}
        style={{
          backgroundImage: bookmark.coverImageUrl
            ? `url(${
                bookmark.coverImageUrl.startsWith("http")
                  ? bookmark.coverImageUrl
                  : `${process.env.NEXT_PUBLIC_API_PREFIX}${bookmark.coverImageUrl}`
              })`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      />
      <CardContent
        className={`${
          viewMode === "grid"
            ? "p-3 pt-2 flex-1"
            : "p-0 flex flex-1 flex-col justify-between"
        }`}
      >
        <div>
          <h3 className="font-medium line-clamp-1 text-sm">{bookmark.title}</h3>
          {viewMode === "list" && bookmark.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {bookmark.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
            <span>{bookmark.siteName}</span>
            <span>•</span>
            <span>{bookmark.readingTime} {t("common.minutes")}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <Star
              className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground"
              onClick={handleStarClick}
              fill={bookmark.isStarred? "yellow" : "none"}
            />
            <Archive
              className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground"
              onClick={handleArchiveClick}
              fill={bookmark.isArchive? "yellow" : "none"}
            />
            <SquareArrowOutUpRight
              className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                window.open(bookmark.sourceUrl, "_blank");
              }}
            />
          </div>
          <Trash
            className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(bookmark);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
