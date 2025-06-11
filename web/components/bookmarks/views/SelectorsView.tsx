/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CommonConfirmDialog } from "@/components/common/CommonConfirmDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { type Selector } from "@/lib/types/bookmark";
import { SelectorTable } from "../selectors/SelectorTable";
import { SelectorDialog } from "../selectors/SelectorDialog";
import {
  listBmSelectors,
  saveBmSelector,
  deleteBmSelector,
  updateBmSelector,
} from "@/api/bookmark/bookmark_selector";

interface Props {
  onUpdateBookmarkNum: () => void;
}

export function SelectorsView({ onUpdateBookmarkNum }: Props) {
  const { t } = usePolyglot();
  const [selectors, setSelectors] = useState<Selector[]>([]);
  const [selectorTotal, setSelectorTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<Selector>({
    id: 0,
    domain: "",
    title: "",
    content: "",
    byline: "",
    excerpt: "",
    publishedTime: "",
    cookie: "",
  });
  const [deletingSelectorId, setDeletingSelectorId] = useState<number | null>(
    null
  );

  const fetchSelectors = async (page = 1) => {
    try {
      const res = await listBmSelectors({
        pageNum: page,
        pageSize,
      });
      if (res.code === 0) {
        setSelectors(res.data.rows);
        setSelectorTotal(res.data.total);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSelectors(1);
  }, []);

  const handleEdit = (selector: Selector) => {
    setFormData(selector);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingSelectorId(id);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (data: Selector) => {
    if (!data.domain.trim()) {
      toast.error(t("bookmark.selector.valid.domain"));
      return;
    }

    try {
      const res =
        data.id > 0 ? await updateBmSelector(data) : await saveBmSelector(data);

      if (res.code === 0) {
        toast.success(t("toast.success"));
        fetchSelectors(currentPage);
        setModalOpen(false);
        setFormData({
          id: 0,
          domain: "",
          title: "",
          content: "",
          byline: "",
          excerpt: "",
          publishedTime: "",
          cookie: "",
        });
        onUpdateBookmarkNum();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (deletingSelectorId) {
      try {
        const res = await deleteBmSelector(deletingSelectorId);
        if (res.code === 0) {
          toast.success(t("toast.success"));
          fetchSelectors(currentPage);
          onUpdateBookmarkNum();
        } else {
          toast.error(res.msg);
        }
      } catch (error) {
        console.log(error);
      }
      setDeleteModalOpen(false);
      setDeletingSelectorId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchSelectors(page);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">
          {t("bookmark.selector.title")}
        </h2>
        <Button
          onClick={() => {
            setFormData({
              id: 0,
              domain: "",
              title: "",
              content: "",
              byline: "",
              excerpt: "",
              publishedTime: "",
              cookie: "",
            });
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("bookmark.selector.add")}
        </Button>
      </div>

      {selectors && selectors.length > 0 ? (
        <>
          <SelectorTable
            selectors={selectors}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
          {selectorTotal > 0 && (
            <Pagination className="mt-4">
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
                  length: Math.min(5, Math.ceil(selectorTotal / pageSize)),
                }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePageChange(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (currentPage < Math.ceil(selectorTotal / pageSize)) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={
                      currentPage >= Math.ceil(selectorTotal / pageSize)
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium mb-2">
            {t("bookmark.empty.selector.title")}
          </p>
          <p className="text-sm text-gray-400">
            {t("bookmark.empty.selector.description")}
          </p>
        </div>
      )}

      <SelectorDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={formData}
        onSubmit={handleSubmit}
      />

      <CommonConfirmDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        title={t("bookmark.selector.delete")}
        description={t("bookmark.selector.deleteMessage")}
      />
    </div>
  );
}
