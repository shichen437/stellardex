import { useEffect } from "react";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { type SubCurrency } from "@/lib/types/subscription";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SubCurrency;
  onSubmit: (data: SubCurrency) => void;
}

export function CurrencyDialog({ open, onOpenChange, data, onSubmit }: Props) {
  const { t } = usePolyglot();
  const formSchema = z.object({
    code: z
      .string()
      .min(1, t("subscription.currency.valid.code"))
      .max(5, t("subscription.currency.valid.code")),
    symbol: z
      .string()
      .min(1, t("subscription.currency.valid.symbol"))
      .max(5, t("subscription.currency.valid.symbol")),
    rate: z.number().min(0, t("subscription.currency.valid.rate")),
    sort: z
      .number()
      .min(0, t("subscription.currency.valid.sort"))
      .max(99, t("subscription.currency.valid.sort")),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      symbol: "",
      rate: 1,
      sort: 1,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        code: data.code,
        symbol: data.symbol,
        rate: data.rate,
        sort: data.sort,
      });
    }
  }, [data, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...data,
      ...values,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {data.id > 0
              ? t("subscription.currency.edit")
              : t("subscription.currency.add")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("subscription.currency.field.code")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("subscription.currency.field.symbol")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("subscription.currency.field.rate")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("subscription.currency.field.sort")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">{t("common.save")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
