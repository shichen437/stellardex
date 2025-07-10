import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { updateProfile } from "@/api/profile";
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

export interface ProfileModalProps {
  userInfo: {
    nickname: string;
    email: string;
    sex: number;
    mobile: string;
  } | null;
}

export const ProfileModal = ({ userInfo }: ProfileModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = usePolyglot();
  const formSchema = z.object({
    nickname: z.string().min(1, t("profile.error.nickname")).max(12, t("users.error.nicknameLimit")),
    email: z.string().min(1, t("profile.error.email")).email(t("profile.error.emailValid")),
    gender: z.enum(["0", "1"], {
      required_error: t("profile.error.sex"),
    }),
    mobile: z
      .string()
      .min(1, t("profile.error.phone"))
      .regex(/^\d{11}$/, t("profile.error.phoneValid")),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      email: "",
      gender: "1",
      mobile: "",
    },
  });

  useEffect(() => {
    if (userInfo && open) {
      const gender = userInfo.sex !== undefined ? String(userInfo.sex) : "1";
      const validGender = gender === "0" ? "0" : "1";
      form.reset({
        nickname: userInfo.nickname || "",
        email: userInfo.email || "",
        gender: validGender,
        mobile: userInfo.mobile || "",
      });
    }
  }, [userInfo, open, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const res = await updateProfile({
        nickname: values.nickname,
        email: values.email,
        sex: Number(values.gender),
        mobile: values.mobile,
      });
      if (res.code === 0) {
        toast.success("修改成功");
        setOpen(false);
        form.reset();
      } else {
        form.setError("root", { message: res.msg });
      }
    } catch (e) {
      console.error(e);
      form.setError("root", { message: "提交失败，请重试" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t("profile.updateProfile")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs w-full rounded-xl shadow-2xl p-8 bg-popover dark:bg-popover"  onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t("profile.updateProfile")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("userField.nickname")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("profile.placeholder.nickname")}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("userField.email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("profile.placeholder.email")}
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("userField.sex")}</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("profile.placeholder.sex")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">{t("userField.sex_male")}</SelectItem>
                      <SelectItem value="0">
                        {t("userField.sex_female")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("userField.phone")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("profile.placeholder.phone")}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-xs text-red-500 text-center">
                {form.formState.errors.root.message}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t("common.loading") : t("common.confirm")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
