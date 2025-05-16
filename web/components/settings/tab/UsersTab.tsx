import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { listUser, delUser, resetPwd } from "@/api/user";
import { UserModal } from "../modal/UserModal"; // 新增
import { PlusCircle, Edit, Trash2, RotateCcwKey } from "lucide-react";
import { UserInfo } from "@/lib/types/user";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
                <h2 className="text-lg font-medium">用户列表</h2>
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
                        <TableHead>用户名</TableHead>
                        <TableHead>昵称</TableHead>
                        <TableHead>性别</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>
                            <div className="flex justify-end items-center h-10">操作</div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5}>加载中...</TableCell>
                        </TableRow>
                    ) : users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5}>暂无数据</TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.nickname}</TableCell>
                                <TableCell>
                                    {user.sex === 1 ? "男" : user.sex === 2 ? "女" : "未知"}
                                </TableCell>
                                <TableCell>
                                    {user.status === 1 ? (
                                        <span className="text-green-600">正常</span>
                                    ) : (
                                        <span className="text-red-500">禁用</span>
                                    )}
                                </TableCell>
                                <TableCell>{user.roleName}</TableCell>
                                <TableCell>
                                    <div className="flex justify-end items-center space-x-2 h-10">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    onClick={() => setResetPwdUser(user)}
                                                    className="p-2 rounded-lg text-red-500 hover:text-red-700"
                                                    title="重置密码"
                                                >
                                                    <RotateCcwKey className="w-4 h-4" />
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>重置密码</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        确定要重置用户「{user.nickname}」的密码吗？此操作不可撤销。
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={async () => {
                                                            await resetPwd({ userId: resetPwdUser!.id });
                                                            setResetPwdUser(null);
                                                        }}
                                                    >
                                                        确定
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700"
                                            title="编辑用户"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        {/* 删除按钮使用 AlertDialog */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    onClick={() => setDeletingUser(user)}
                                                    className="p-2 rounded-lg text-red-500 hover:text-red-700"
                                                    title="删除用户"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>删除用户</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        确定要删除用户「{user.nickname}」吗？此操作不可撤销。
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={async () => {
                                                            await handleDelete(deletingUser!.id);
                                                            setDeletingUser(null);
                                                        }}
                                                    >
                                                        确认删除
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
                            <PaginationLink
                                isActive={page === 1}
                                onClick={() => setPage(1)}
                            >
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