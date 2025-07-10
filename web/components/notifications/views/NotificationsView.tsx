/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash, CheckCheck, Bell, BellDot, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  getNotifyList,
  deleteNotify,
  deleteAll,
  readAll,
} from "@/api/notification/sys_notify";
import { Notification } from "@/lib/types/notification";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { CommonConfirmDialog } from "@/components/common/CommonConfirmDialog";

interface NotificationsViewProps {
  currentStatus?: number;
  categoryName?: string;
}

export const NotificationsView = ({
  currentStatus,
  categoryName = "通知列表",
}: NotificationsViewProps) => {
  const { t } = usePolyglot();
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [readAllModalOpen, setReadAllModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const fetchNotifications = async (page = 1) => {
    const res = await getNotifyList({
      pageNum: page,
      pageSize,
      status: currentStatus,
    });
    if (res.code === 0) {
      setNotifications(res.data.rows);
      setTotal(res.data.total);
    } else {
      toast.error(res.msg);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage, currentStatus]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedNotification) {
      try {
        const res = await deleteNotify(selectedNotification.id);
        if (res.code === 0) {
          toast.success(t("toast.success"));
          fetchNotifications(currentPage);
        } else {
          toast.error(res.msg);
        }
      } catch (error) {
        console.log(error);
      }
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const res = await deleteAll();
      if (res.code === 0) {
        toast.success(t("toast.success"));
        fetchNotifications(1);
        setCurrentPage(1);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
    setDeleteAllModalOpen(false);
  };

  const handleReadAll = async () => {
    try {
      const res = await readAll();
      if (res.code === 0) {
        toast.success(t("toast.success"));
        fetchNotifications(currentPage);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
    setReadAllModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const getNotificationStatusClass = (status: number) => {
    return status === 0 ? "bg-blue-50 dark:bg-slate-700 font-medium" : "";
  };

  const getNotificationTypeText = (type: number) => {
    switch (type) {
      case 1:
        return t("notification.type.system");
      case 2:
        return t("notification.type.activity");
      case 3:
        return t("notification.type.update");
      default:
        return t("notification.type.system");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-medium">{categoryName}</h2>
        <div className="flex items-center gap-2">
          {currentStatus !== 1 && total > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReadAllModalOpen(true)}
              className="flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
              {t("notification.allRead")}
            </Button>
          )}
          {currentStatus === undefined && total > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteAllModalOpen(true)}
              className="flex items-center gap-1 text-destructive hover:text-destructive"
            >
              <Trash className="w-4 h-4" />
              {t("notification.deleteAll")}
            </Button>
          )}
        </div>
      </div>

      {notifications && notifications.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] py-3 text-center">
                {t("notification.table.title")}
              </TableHead>
              <TableHead className="w-[40%] py-3 text-center">
                {t("notification.table.content")}
              </TableHead>
              <TableHead className="w-[120px] py-3 text-center">
                {t("notification.table.type")}
              </TableHead>
              <TableHead className="w-[180px] py-3 text-center">
                {t("notification.table.time")}
              </TableHead>
              <TableHead className="w-[100px] py-3 text-center">
                {t("common.options")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow
                key={notification.id}
                className={getNotificationStatusClass(notification.status)}
              >
                <TableCell className="font-medium text-center">
                  <div className="flex items-center justify-center gap-2">
                    {notification.status === 0 && (
                      <div
                        className="w-2 h-2 rounded-full bg-cyan-500"
                        title={t("notification.nav.unread")}
                      ></div>
                    )}
                    {notification.title}
                  </div>
                </TableCell>
                <TableCell className="max-w-[400px] text-center">
                  <div
                    className="truncate text-center mx-auto"
                    title={notification.content}
                  >
                    {notification.content}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span>{getNotificationTypeText(notification.type)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {formatDate(notification.createAt)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive mx-auto"
                    onClick={() => handleDeleteClick(notification)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border rounded-md bg-card">
          {currentStatus === 0 ? (
            <BellDot className="w-12 h-12 text-muted-foreground mb-4" />
          ) : currentStatus === 1 ? (
            <Bell className="w-12 h-12 text-muted-foreground mb-4" />
          ) : (
            <BellRing className="w-12 h-12 text-muted-foreground mb-4" />
          )}
          <h3 className="text-lg font-medium mb-2">
            {currentStatus === 0
              ? t("notification.empty.unread.title")
              : currentStatus === 1
              ? t("notification.empty.read.title")
              : t("notification.empty.all.title")}
          </h3>
          <p className="text-muted-foreground">
            {currentStatus === 0
              ? t("notification.empty.unread.description")
              : currentStatus === 1
              ? t("notification.empty.read.description")
              : t("notification.empty.all.description")}
          </p>
        </div>
      )}

      {total > 0 && notifications.length > 0 && (
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
        title={t("notification.delete")}
        description={t("notification.deleteMessage")}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
      />

      <CommonConfirmDialog
        title={t("notification.deleteAll")}
        description={t("notification.deleteAllMessage")}
        open={deleteAllModalOpen}
        onOpenChange={setDeleteAllModalOpen}
        onConfirm={handleDeleteAll}
      />

      <CommonConfirmDialog
        title={t("notification.allRead")}
        description={t("notification.allReadMessage")}
        open={readAllModalOpen}
        onOpenChange={setReadAllModalOpen}
        onConfirm={handleReadAll}
      />
    </div>
  );
};
