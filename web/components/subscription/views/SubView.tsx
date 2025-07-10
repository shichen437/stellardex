/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Plus, BadgeDollarSign } from "lucide-react";
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
import { type Subscription } from "@/lib/types/subscription";
import { SubTable } from "@/components/subscription/table/SubTable";
import { SubDialog } from "@/components/subscription/modal/SubDialog";
import {
  getSubList,
  addSub,
  updateSub,
  deleteSub,
  enableSub,
  disableSub,
} from "@/api/subscription/subscription";

export function SubView() {
  const { t } = usePolyglot();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<Subscription>({
    id: 0,
    title: "",
    amount: 0,
    cycleNum: 1,
    cycleType: 0,
    cycleDay: 0,
    startDate: "",
    nextDate: "",
    currency: 0,
    category: "",
    site: "",
    status: 0,
    createAt: "",
  });
  const [deletingSubId, setDeletingSubId] = useState<number | null>(null);

  const fetchSubs = async (page = 1) => {
    try {
      const res = await getSubList({
        pageNum: page,
        pageSize,
      });
      if (res.code === 0) {
        setSubs(res.data.rows);
        setSubTotal(res.data.total);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSubs(1);
  }, []);

  const handleEdit = (sub: Subscription) => {
    setFormData(sub);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingSubId(id);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (data: Subscription) => {
    if (!data.title.trim()) {
      toast.error(t("subscription.valid.title"));
      return;
    }

    try {
      const res = data.id > 0 ? await updateSub(data) : await addSub(data);

      if (res.code === 0) {
        toast.success(t("toast.success"));
        fetchSubs(currentPage);
        setModalOpen(false);
        setFormData({
          id: 0,
          title: "",
          amount: 0,
          cycleNum: 1,
          cycleType: 0,
          cycleDay: 0,
          startDate: "",
          nextDate: "",
          currency: 0,
          category: "",
          site: "",
          status: 0,
          createAt: "",
        });
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (deletingSubId) {
      try {
        const res = await deleteSub(deletingSubId);
        if (res.code === 0) {
          toast.success(t("toast.success"));
          fetchSubs(currentPage);
        } else {
          toast.error(res.msg);
        }
      } catch (error) {
        console.log(error);
      }
      setDeleteModalOpen(false);
      setDeletingSubId(null);
    }
  };

  const handleEnable = async (id: number) => {
    try {
      const res = await enableSub(id);
      if (res.code === 0) {
        toast.success(t("toast.success"));
        fetchSubs(currentPage);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisable = async (id: number) => {
    try {
      const res = await disableSub(id);
      if (res.code === 0) {
        toast.success(t("toast.success"));
        fetchSubs(currentPage);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchSubs(page);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">{t("subscription.title")}</h2>
        <Button
          onClick={() => {
            setFormData({
              id: 0,
              title: "",
              amount: 0,
              cycleNum: 1,
              cycleType: 0,
              cycleDay: 0,
              startDate: "",
              nextDate: "",
              currency: 0,
              category: "",
              site: "",
              status: 0,
              createAt: "",
            });
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("subscription.add")}
        </Button>
      </div>

      {subs && subs.length > 0 ? (
        <>
          <SubTable
            subs={subs}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onEnable={handleEnable}
            onDisable={handleDisable}
            onRefresh={fetchSubs}
          />
          {subTotal > 0 && (
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
                  length: Math.min(5, Math.ceil(subTotal / pageSize)),
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
                      if (currentPage < Math.ceil(subTotal / pageSize)) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={
                      currentPage >= Math.ceil(subTotal / pageSize)
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
          <BadgeDollarSign className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium mb-2">
            {t("subscription.empty.sub.title")}
          </p>
          <p className="text-sm text-gray-400">
            {t("subscription.empty.sub.description")}
          </p>
        </div>
      )}

      <SubDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={formData}
        onSubmit={handleSubmit}
      />

      <CommonConfirmDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        title={t("subscription.delete")}
        description={t("subscription.deleteMessage")}
      />
    </div>
  );
}
