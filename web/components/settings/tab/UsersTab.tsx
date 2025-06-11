import React, { useEffect, useState } from "react";
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
import { listUser, delUser, resetPwd } from "@/api/user";
import { UserModal } from "../modal/UserModal"; // 新增
import { PlusCircle, Edit, Trash2, RotateCcwKey } from "lucide-react";
import { UserInfo } from "@/lib/types/user";
import { CommonConfirmDialog } from "@/components/common/CommonConfirmDialog";
import { usePolyglot } from "@/providers/PolyglotProvider";

export function UsersTab() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<UserInfo | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserInfo | null>(null);
  const [resetPwdUser, setResetPwdUser] = useState<UserInfo | null>(null);
  const { t } = usePolyglot();

  const fetchUsers = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await listUser({ pageNum, pageSize });
      if (res.code === 0) {
        console.log(res.data);
        setUsers(res.data?.rows || []);
        setTotal(res.data?.total || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id: number) => {
    await delUser(id);
    fetchUsers(page);
  };

  // 分页页数
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">{t("users.list")}</h2>
        <button
          onClick={() => setModalOpen(true)}
          className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`}
          title="添加用户"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">
              {t("userField.username")}
            </TableHead>
            <TableHead className="text-center">
              {t("userField.nickname")}
            </TableHead>
            <TableHead className="text-center">{t("userField.sex")}</TableHead>
            <TableHead className="text-center">
              {t("userField.status")}
            </TableHead>
            <TableHead className="text-center">{t("userField.role")}</TableHead>
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
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {t("common.empty")}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-center">{user.username}</TableCell>
                <TableCell className="text-center">{user.nickname}</TableCell>
                <TableCell className="text-center">
                  {user.sex === 1
                    ? t("userField.sex_male")
                    : t("userField.sex_female")}
                </TableCell>
                <TableCell className="text-center">
                  {user.status === 1 ? (
                    <span className="text-green-600">
                      {t("userField.status_active")}
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {t("userField.status_inactive")}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {user.roleId === 1
                    ? t("userField.role_admin")
                    : t("userField.role_user")}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center items-center space-x-2 h-10">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-2 rounded-lg text-gray-500 hover:text-gray-700"
                      title={t("users.edit")}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setResetPwdUser(user)}
                      className="p-2 rounded-lg text-red-500 hover:text-red-700"
                      title={t("users.resetPwd")}
                    >
                      <RotateCcwKey className="w-4 h-4" />
                    </button>

                    <CommonConfirmDialog
                      open={!!resetPwdUser}
                      onOpenChange={(open) =>
                        setResetPwdUser(open ? resetPwdUser : null)
                      }
                      onConfirm={async () => {
                        await resetPwd({ userId: resetPwdUser!.id });
                        setResetPwdUser(null);
                      }}
                      title={t("users.resetPwd")}
                      description={t("users.resetPwdMessage")}
                    />

                    <button
                      onClick={() => setDeletingUser(user)}
                      className="p-2 rounded-lg text-red-500 hover:text-red-700"
                      title={t("users.delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <CommonConfirmDialog
                      open={!!deletingUser}
                      onOpenChange={(open) =>
                        setDeletingUser(open ? deletingUser : null)
                      }
                      onConfirm={async () => {
                        await handleDelete(deletingUser!.id);
                        setDeletingUser(null);
                      }}
                      title={t("users.delete")}
                      description={t("users.deleteMessage")}
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
      {/* 添加用户弹窗 */}
      <UserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => {
          setModalOpen(false);
          fetchUsers(page);
        }}
      />
      {/* 编辑用户弹窗 */}
      <UserModal
        open={!!editingUser}
        userInfo={editingUser || undefined}
        onOpenChange={(open) => {
          setEditingUser(open ? editingUser : null);
        }}
        onSuccess={() => {
          setEditingUser(null);
          fetchUsers(page);
        }}
      />
    </div>
  );
}
