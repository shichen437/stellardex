import React, { useEffect, useState } from "react";
import { PlusCircle, Ban, Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ApiKeyInfo } from "@/lib/types/api_key";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { listApiKey, deleteApiKey, disableApiKey } from "@/api/api_key";
import { CommonConfirmDialog } from "@/components/common/CommonConfirmDialog";
import { ApiKeyModal } from "../modal/ApiKeyModal";

export function ApiKeyTab() {
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingApiKey, setDeletingApiKey] = useState<ApiKeyInfo | null>(null);
  const [disablingApiKey, setDisablingApiKey] = useState<ApiKeyInfo | null>(
    null
  );
  const { t } = usePolyglot();

  const fetchApiKeyList = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await listApiKey({ pageNum, pageSize });
      if (res.code === 0) {
        console.log(res.data);
        setApiKeys(res.data?.rows || []);
        setTotal(res.data?.total || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeyList(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id: number) => {
    await deleteApiKey(id);
    fetchApiKeyList(page);
  };

  const handleDisable = async (id: number) => {
    await disableApiKey(id);
    fetchApiKeyList(page);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">{t("apiKey.list")}</h2>
        <button
          onClick={() => setModalOpen(true)}
          className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`}
          title="添加ApiKey"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">
              {t("apiKey.fields.apiKeyName")}
            </TableHead>
            <TableHead className="text-center">
              {t("apiKey.fields.apiKey")}
            </TableHead>
            <TableHead className="text-center">
              {t("apiKey.fields.status")}
            </TableHead>
            <TableHead className="text-center">
              {t("apiKey.fields.expiresAt")}
            </TableHead>
            <TableHead className="text-center">
              <div className="flex justify-center items-center h-10">
                {t("common.options")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {t("common.loading")}
              </TableCell>
            </TableRow>
          ) : apiKeys.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {t("common.empty")}
              </TableCell>
            </TableRow>
          ) : (
            apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell className="text-center">
                  {apiKey.apiKeyName}
                </TableCell>
                <TableCell className="text-center">{apiKey.apiKey}</TableCell>
                <TableCell className="text-center">
                  {apiKey.status === 1 ? (
                    <span className="text-green-600">
                      {t("apiKey.fields.status_active")}
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {t("apiKey.fields.status_invalid")}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {apiKey.expiresAt}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center items-center space-x-2 h-10">
                    {apiKey.status === 1 ? (
                      <button
                        onClick={() => setDisablingApiKey(apiKey)}
                        disabled={apiKey.status !== 1}
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-700"
                        title={t("apiKey.disable")}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    ) : null}
                    <CommonConfirmDialog
                      open={!!disablingApiKey}
                      onOpenChange={(open) =>
                        setDisablingApiKey(open ? disablingApiKey : null)
                      }
                      onConfirm={async () => {
                        await handleDisable(disablingApiKey!.id);
                        setDisablingApiKey(null);
                      }}
                      title={t("apiKey.disable")}
                      description={t("apiKey.disableMessage")}
                    />
                    <button
                      onClick={() => setDeletingApiKey(apiKey)}
                      className="p-2 rounded-lg text-red-500 hover:text-red-700"
                      title={t("users.delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <CommonConfirmDialog
                      open={!!deletingApiKey}
                      onOpenChange={(open) =>
                        setDeletingApiKey(open ? deletingApiKey : null)
                      }
                      onConfirm={async () => {
                        await handleDelete(deletingApiKey!.id);
                        setDeletingApiKey(null);
                      }}
                      title={t("apiKey.delete")}
                      description={t("apiKey.deleteMessage")}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(1, totalPages)
              .map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={page === p}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
          </PaginationContent>
        </Pagination>
      </div>
      <ApiKeyModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
        }}
        onSuccess={() => {
          setModalOpen(false);
          fetchApiKeyList(page);
        }}
      />
    </div>
  );
}
