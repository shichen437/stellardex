import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, addYears, format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from "react";
import { addApiKey } from "@/api/api_key";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type ExpiryOption = "1m" | "3m" | "6m" | "1y" | "never";

const getExpiryDate = (option: ExpiryOption): string | undefined => {
  const now = new Date();
  switch (option) {
    case "1m":
      return format(addMonths(now, 1), "yyyy-MM-dd");
    case "3m":
      return format(addMonths(now, 3), "yyyy-MM-dd");
    case "6m":
      return format(addMonths(now, 6), "yyyy-MM-dd");
    case "1y":
      return format(addYears(now, 1), "yyyy-MM-dd");
    case "never":
      return undefined;
  }
};

export const ApiKeyModal = ({
  open,
  onOpenChange,
  onSuccess,
}: ApiKeyModalProps) => {
  const { t } = usePolyglot();
  const [newApiKey, setNewApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState(false);
  const formSchema = z.object({
    apiKeyName: z
      .string()
      .min(1, t("users.error.username"))
      .max(12, t("users.error.usernameLimit")),
    expiresAt: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKeyName: "",
      expiresAt: "never",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        apiKeyName: "",
        expiresAt: "never",
      });
    }
  }, [open, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await addApiKey({
        apiKeyName: values.apiKeyName,
        expiresAt: getExpiryDate(values.expiresAt as ExpiryOption),
      });
      if (res.code === 0) {
        setNewApiKey(res.data.apiKey);
        setShowApiKey(true);
      } else {
        form.setError("root", { message: res.msg || "操作失败" });
      }
    } catch (e) {
      console.error(e);
      form.setError("root", { message: "请求失败，请重试" });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(newApiKey);
      toast.success(t("toast.copied"));
      setShowApiKey(false);
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.log(err);
      toast.error(t("toast.copyFailed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-xl shadow-2xl p-8 bg-popover dark:bg-popover">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {showApiKey ? t("apiKey.copy") : t("apiKey.add")}
          </DialogTitle>
        </DialogHeader>
        {showApiKey ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg break-all">
              <p className="text-sm mb-2">{t("apiKey.copyPrompt")}</p>
              <code className="text-sm">{newApiKey}</code>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={handleCopy}>{t("common.copy")}</Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="apiKeyName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("apiKey.fields.apiKeyName")}</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder={t("apiKey.placeholder.apiKeyName")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("apiKey.fields.expiresAt")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("apiKey.placeholder.expiresAt")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1m">
                          {t("apiKey.expiry.oneMonth")}
                        </SelectItem>
                        <SelectItem value="3m">
                          {t("apiKey.expiry.threeMonth")}
                        </SelectItem>
                        <SelectItem value="6m">
                          {t("apiKey.expiry.sixMonth")}
                        </SelectItem>
                        <SelectItem value="1y">
                          {t("apiKey.expiry.oneYear")}
                        </SelectItem>
                        <SelectItem value="forever">
                          {t("apiKey.expiry.forever")}
                        </SelectItem>
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
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit">{t("common.confirm")}</Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
