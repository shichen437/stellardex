/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LayoutGrid, List, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { type Bookmark, SearchParams } from "@/lib/types/bookmark";
import { usePolyglot } from "@/providers/PolyglotProvider";
import {
  listBookmark,
  saveBookmark,
  deleteBookmark,
  updateStatus,
} from "@/api/bookmark/bookmark";
import { EmptyState } from "@/components/bookmarks/home/EmptyState";
import { BookmarkCard } from "@/components/bookmarks/home/BookmarkCard";
import { CommonConfirmDialog } from "@/components/common/CommonConfirmDialog";
import { SortDropdownMenu } from "@/components/bookmarks/dropdownmenu/SortDropdownMenu";
import { FilterDropdownMenu } from "@/components/bookmarks/dropdownmenu/FilterDropdownMenu";

interface Props {
  categoryName: string;
  currentStatus?: number;
  currentGroup?: string;
  isArchive?: number;
  isStarred?: number;
  onUpdateBookmarkNum: () => void;
  initialSearchParams?: {
    label?: string;
  };
}

export const BookmarksView = forwardRef<
  { handleSearch: (params: SearchParams) => void },
  Props
>(function BookmarksView(
  {
    categoryName,
    currentStatus,
    currentGroup,
    isArchive,
    isStarred,
    onUpdateBookmarkNum,
    initialSearchParams,
  },
  ref
) {
  const { t } = usePolyglot();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<string>("");
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    author: "",
    site: "",
    label: initialSearchParams?.label || "",
  });
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );
  const formRef = useRef<HTMLFormElement>(
    null
  ) as React.RefObject<HTMLFormElement>;

  const formSchema = z.object({
    url: z
      .string()
      .min(1, t("bookmark.valid.url"))
      .url(t("bookmark.valid.url")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  const fetchBookmarks = async (page = 1, params?: SearchParams) => {
    const res = await listBookmark({
      pageNum: page,
      pageSize,
      status: currentStatus,
      sort,
      keyword: params?.keyword ?? searchParams.keyword,
      author: params?.author ?? searchParams.author,
      site: params?.site ?? searchParams.site,
      label: params?.label ?? searchParams.label,
      isArchive,
      isStarred,
    });
    if (res.code === 0) {
      setBookmarks(res.data.rows);
      setTotal(res.data.total);
    } else {
      toast.error(res.msg);
    }
  };

  const handleSaveBookmark = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await saveBookmark({ url: values.url });
      if (res.code === 0) {
        toast.success(t("toast.success"));
        fetchBookmarks(1);
        onUpdateBookmarkNum();
      } else {
        toast.error(res.msg);
      }
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBookmarks(1);
  };

  const handleReset = () => {
    setSearchParams({
      keyword: "",
      author: "",
      site: "",
      label: "",
    });
    setCurrentPage(1);
    fetchBookmarks(1, {
      keyword: "",
      author: "",
      site: "",
      label: "",
    });
  };

  const handleDeleteClick = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedBookmark) {
      try {
        const res = await deleteBookmark(selectedBookmark.id);
        if (res.code === 0) {
          toast.success(t("toast.success"));
          fetchBookmarks(1);
          onUpdateBookmarkNum();
        } else {
          toast.error(res.msg);
        }
      } catch (error) {
        console.log(error);
      }
      setDeleteModalOpen(false);
    }
  };

  const handleUpdateStatus = async (data: {
    id: number;
    status: number;
    type: number;
  }) => {
    const res = await updateStatus(data);
    if (res.code === 0) {
      fetchBookmarks(currentPage);
      onUpdateBookmarkNum();
    } else {
      toast.error(res.msg);
    }
  };

  const handleSortChange = (sortValue: string) => {
    setSort(sortValue);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchBookmarks(currentPage);
  }, [currentPage, sort]);

  useEffect(() => {
    setCurrentPage(1);
    fetchBookmarks(1);
  }, [currentStatus, currentGroup, isArchive, isStarred]);

  useImperativeHandle(ref, () => ({
    handleSearch: (params: SearchParams) => {
      setSearchParams(params);
      setCurrentPage(1);
      fetchBookmarks(1);
    },
  }));

  return (
    <>
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(handleSaveBookmark)}
          className="flex flex-col gap-4 mb-8"
        >
          <div className="flex items-start gap-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="https://"
                      className="rounded-full h-12 text-base px-6 shadow-sm"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          form.handleSubmit(handleSaveBookmark)();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="px-6 mt-1" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-12 px-6 rounded-full flex items-center gap-2 text-base font-semibold"
              disabled={isLoading}
            >
              <Plus className="w-5 h-5" /> {t("bookmark.saveLink")}
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">{categoryName}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 ${viewMode === "grid" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 ${viewMode === "list" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <SortDropdownMenu sort={sort} onSortChange={handleSortChange} />
          <FilterDropdownMenu
            searchParams={searchParams}
            onSearchParamsChange={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {bookmarks && bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              viewMode={viewMode}
              onDelete={handleDeleteClick}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        ) : (
          <EmptyState status={currentStatus} group={currentGroup} />
        )}
      </div>

      {total > 0 && bookmarks.length > 0 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({
              length: Math.min(5, Math.ceil(total / pageSize)),
            }).map((_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (currentPage < Math.ceil(total / pageSize)) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                className={
                  currentPage >= Math.ceil(total / pageSize)
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <CommonConfirmDialog
        title={t("bookmark.delete")}
        description={t("bookmark.deleteMessage")}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
      />
    </>
  );
});
