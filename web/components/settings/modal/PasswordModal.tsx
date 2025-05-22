import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePwd } from "@/api/profile";
import React, { useState } from "react";
import { toast } from "sonner";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const PasswordModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = usePolyglot();
  const formSchema = z
    .object({
      oldPwd: z.string().min(6, t("profile.error.oldPwd")).max(20, t("profile.error.oldPwd")),
      newPwd: z
        .string()
        .min(6, t("profile.error.newPwd"))
        .max(20, t("profile.error.newPwd")),
      confirmPwd: z.string().min(1, t("profile.error.confirmPwd")),
    })
    .refine((data) => data.newPwd === data.confirmPwd, {
      message: t("profile.error.newPwdMatch"),
      path: ["confirmPwd"],
    })
    .refine((data) => data.oldPwd !== data.newPwd, {
      message: t("profile.error.newPwdSame"),
      path: ["newPwd"],
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPwd: "",
      newPwd: "",
      confirmPwd: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const res = await updatePwd(values.oldPwd, values.newPwd);
      if (res.code === 0) {
        toast.success(t("toast.success"));
        setOpen(false);
        form.reset();
      } else {
        toast.error(res.msg);
      }
    } catch (e) {
      console.error(e);
      form.setError("root", { message: "请求失败" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t("profile.updatePwd")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs w-full rounded-xl shadow-2xl p-8 bg-popover dark:bg-popover">
        <DialogHeader>
          <DialogTitle>{t("profile.updatePwd")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="oldPwd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.oldPwd")}</FormLabel>
                  <FormControl>
                    <Input type="password" disabled={loading} {...field} placeholder={t("profile.placeholder.oldPwd")}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPwd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.newPwd")}</FormLabel>
                  <FormControl>
                    <Input type="password" disabled={loading} {...field} placeholder={t("profile.placeholder.newPwd")}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPwd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.confirmPwd")}</FormLabel>
                  <FormControl>
                    <Input type="password" disabled={loading} {...field} placeholder={t("profile.placeholder.confirmPwd")}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-red-500 text-xs text-center">
                {form.formState.errors.root.message}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
                disabled={loading}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {t("common.confirm")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
