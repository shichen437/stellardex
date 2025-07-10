import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { listRole } from "@/api/role";
import { postUser, putUser } from "@/api/user";
import { toast } from "sonner";
import { UserInfo } from "@/lib/types/user";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo?: UserInfo;
  onSuccess?: () => void;
}

export const UserModal = ({
  open,
  onOpenChange,
  userInfo,
  onSuccess,
}: UserModalProps) => {
  const isEdit = !!userInfo;
  const [loading, setLoading] = useState(false);
  const { t } = usePolyglot();
  const [roles, setRoles] = useState<{ id: number; roleName: string }[]>([]);
  const formSchema = z.object({
    username: z
      .string()
      .min(1, t("users.error.username"))
      .max(12, t("users.error.usernameLimit")),
    nickname: z
      .string()
      .min(1, t("users.error.nickname"))
      .max(12, t("users.error.nicknameLimit")),
    roleId: z.string().min(1, t("users.error.role")),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      nickname: "",
      roleId: "",
    },
  });

  useEffect(() => {
    if (open) {
      listRole().then((res) => {
        if (res.data?.roles) {
          setRoles(res.data.roles || []);
        }
      });
      if (isEdit) {
        form.reset({
          username: userInfo.username || "",
          nickname: userInfo.nickname || "",
          roleId: String(userInfo.roleId || ""),
        });
      } else {
        form.reset({
          username: "",
          nickname: "",
          roleId: "",
        });
      }
    }
  }, [open, userInfo, isEdit, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await putUser({
          id: userInfo.id,
          username: values.username,
          nickname: values.nickname,
          roleId: Number(values.roleId),
        });
      } else {
        res = await postUser({
          username: values.username,
          nickname: values.nickname,
          roleId: Number(values.roleId),
        });
      }
      if (res.code === 0) {
        toast.success(t("toast.success"));
        onOpenChange(false);
        onSuccess?.();
      } else {
        form.setError("root", { message: res.msg || "操作失败" });
      }
    } catch (e) {
      console.error(e);
      form.setError("root", { message: "请求失败，请重试" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-xl shadow-2xl p-8 bg-popover dark:bg-popover"  onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? t("users.edit") : t("users.add")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("userField.username")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("users.placeholder.username")}
                      disabled={isEdit || loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("userField.nickname")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("users.placeholder.nickname")}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("userField.role")}</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("users.placeholder.role")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.id === 1
                            ? t("userField.role_admin")
                            : r.id === 2
                            ? t("userField.role_user")
                            : r.roleName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-xs text-red-500 text-center">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t("common.loading") : t("common.confirm")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
