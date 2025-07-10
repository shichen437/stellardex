/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Coins } from "lucide-react";
import { usePolyglot } from "@/providers/PolyglotProvider";
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
import { type SubCurrency } from "@/lib/types/subscription";
import { CurrencyTable } from "@/components/subscription/table/CurrencyTable";
import { CurrencyDialog } from "@/components/subscription/modal/CurrencyDialog";
import {
  getCurrencyList,
  addCurrency,
  updateCurrency,
  deleteCurrency,
  defaultCurrency,
} from "@/api/subscription/currency";

export function CurrencyView() {
  const { t } = usePolyglot();
  const [currencies, setCurrencies] = useState<SubCurrency[]>([]);
  const [currencyTotal, setCurrencyTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<SubCurrency>({
    id: 0,
    code: "",
    symbol: "",
    isDefault: false,
    rate: 1,
    sort: 1,
  });
  const [deletingCurrencyId, setDeletingCurrencyId] = useState<number | null>(
    null
  );

  const fetchCurrencies = async (page = 1) => {
    try {
      const res = await getCurrencyList({
        pageNum: page,
        pageSize,
      });
      if (res.code === 0) {
        setCurrencies(res.data.rows);
        setCurrencyTotal(res.data.total);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurrencies(1);
  }, []);

  const handleEdit = (currency: SubCurrency) => {
    setFormData(currency);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingCurrencyId(id);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (data: SubCurrency) => {
    if (!data.code.trim()) {
      toast.error(t("subscription.currency.valid.code"));
      return;
    }

    try {
      const res =
        data.id > 0 ? await updateCurrency(data) : await addCurrency(data);

      if (res.code === 0) {
        toast.success(t("toast.success"));
        fetchCurrencies(currentPage);
        setModalOpen(false);
        setFormData({
          id: 0,
          code: "",
          symbol: "",
          isDefault: false,
          rate: 1,
          sort: 1,
        });
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (deletingCurrencyId) {
      try {
        const res = await deleteCurrency(deletingCurrencyId);
        if (res.code === 0) {
          toast.success(t("toast.success"));
          fetchCurrencies(currentPage);
        } else {
          toast.error(res.msg);
        }
      } catch (error) {
        console.log(error);
      }
      setDeleteModalOpen(false);
      setDeletingCurrencyId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const res = await defaultCurrency(id);
      if (res.code === 0) {
        toast.success(t("toast.success"));
        fetchCurrencies(currentPage);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCurrencies(page);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">
          {t("subscription.currency.title")}
        </h2>
        <Button
          onClick={() => {
            setFormData({
              id: 0,
              code: "",
              symbol: "",
              isDefault: false,
              rate: 1,
              sort: 1,
            });
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("subscription.currency.add")}
        </Button>
      </div>

      {currencies && currencies.length > 0 ? (
        <>
          <CurrencyTable
            currencies={currencies}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onSetDefault={handleSetDefault}
          />
          {currencyTotal > 0 && (
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
                  length: Math.min(5, Math.ceil(currencyTotal / pageSize)),
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
                      if (currentPage < Math.ceil(currencyTotal / pageSize)) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={
                      currentPage >= Math.ceil(currencyTotal / pageSize)
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
          <Coins className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium mb-2">
            {t("subscription.empty.currency.title")}
          </p>
          <p className="text-sm text-gray-400">
            {t("subscription.empty.currency.description")}
          </p>
        </div>
      )}

      <CurrencyDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={formData}
        onSubmit={handleSubmit}
      />

      <CommonConfirmDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        title={t("subscription.currency.delete")}
        description={t("subscription.currency.deleteMessage")}
      />
    </div>
  );
}
