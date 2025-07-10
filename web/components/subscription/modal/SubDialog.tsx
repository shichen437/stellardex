/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon } from "lucide-react";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { type Subscription, SubCurrency } from "@/lib/types/subscription";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCurrencyList } from "@/api/subscription/currency";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Subscription;
  onSubmit: (data: Subscription) => void;
}

export function SubDialog({ open, onOpenChange, data, onSubmit }: Props) {
  const { t } = usePolyglot();
  const [currencies, setCurrencies] = useState<Array<SubCurrency>>([]);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const formSchema = z.object({
    title: z
      .string()
      .min(1, t("subscription.valid.title"))
      .max(12, t("subscription.valid.title")),
    amount: z.number().min(0, t("subscription.valid.amount")),
    cycleNum: z
      .number()
      .min(1, t("subscription.valid.cycleNum"))
      .max(99, t("subscription.valid.cycleNum")),
    cycleType: z.number().min(0, t("subscription.valid.cycleType")).max(4),
    cycleDay: z.number().min(0, t("subscription.valid.cycleDay")).max(2),
    startDate: z.string().min(10, t("subscription.valid.startDate")),
    currency: z.number().min(1, t("subscription.valid.currency")),
    category: z.string().max(12, t("subscription.valid.category")),
    site: z.string().url().optional().or(z.literal("")).optional(),
  });

  const loadCurrencies = async () => {
    try {
      const res = await getCurrencyList({
        pageNum: 1,
        pageSize: 10,
      });
      if (res.data?.rows) {
        setCurrencies(res.data.rows);
      }
    } catch (error) {
      console.error("Failed to load currencies:", error);
    }
  };

  useEffect(() => {
    if (currencyOpen) {
      loadCurrencies();
    }
  }, [currencyOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: 0,
      cycleNum: 1,
      cycleType: 1,
      cycleDay: 0,
      startDate: new Date().toISOString().split("T")[0],
      currency: 1,
      category: "",
      site: "",
    },
  });

  useEffect(() => {
    if (data) {
      const formattedStartDate = data.startDate
        ? format(new Date(data.startDate), "yyyy-MM-dd")
        : new Date().toISOString().split("T")[0];
      form.reset({
        title: data.title,
        amount: data.amount,
        cycleNum: data.cycleNum,
        cycleType: data.cycleType,
        cycleDay: data.cycleDay || 0,
        startDate: formattedStartDate,
        currency: data.currency,
        category: data.category,
        site: data.site,
      });
    }
  }, [data, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...data,
      ...values,
    });
  };

  const cycleType = form.watch("cycleType");
  const showCycleDay = [1, 2, 3].includes(cycleType);

  const getCycleDayOptions = (type: number) => {
    switch (type) {
      case 1:
        return [
          { value: "0", label: t("subscription.cycle.day.naturalYear") },
          { value: "1", label: t("subscription.cycle.day.372") },
          { value: "2", label: t("subscription.cycle.day.360") },
        ];
      case 2:
        return [
          { value: "0", label: t("subscription.cycle.day.naturalQuarter") },
          { value: "1", label: t("subscription.cycle.day.93") },
          { value: "2", label: t("subscription.cycle.day.90") },
        ];
      case 3:
        return [
          { value: "0", label: t("subscription.cycle.day.naturalMonth") },
          { value: "1", label: t("subscription.cycle.day.31") },
          { value: "2", label: t("subscription.cycle.day.30") },
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {data.id > 0 ? t("subscription.edit") : t("subscription.add")}
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subscription.field.title")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subscription.field.amount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cycleNum"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("subscription.field.cycleNum")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-full"
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
                name="cycleType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("subscription.field.cycleType")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        if (![1, 2, 3].includes(Number(value))) {
                          form.setValue("cycleDay", 0);
                        }
                      }}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">
                          {t("subscription.cycle.forever")}
                        </SelectItem>
                        <SelectItem value="1">
                          {t("subscription.cycle.year")}
                        </SelectItem>
                        <SelectItem value="2">
                          {t("subscription.cycle.quarter")}
                        </SelectItem>
                        <SelectItem value="3">
                          {t("subscription.cycle.month")}
                        </SelectItem>
                        <SelectItem value="4">
                          {t("subscription.cycle.week")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showCycleDay && (
                <FormField
                  control={form.control}
                  name="cycleDay"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("subscription.field.cycleDay")}</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getCycleDayOptions(cycleType).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("subscription.field.startDate")}</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>{t("subscription.field.startDate")}</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? parse(field.value, "yyyy-MM-dd", new Date())
                              : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : undefined
                            )
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("subscription.field.currency")}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value.toString()}
                      onOpenChange={(open) => {
                        if (open) {
                          loadCurrencies();
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {field.value
                              ? currencies.find(
                                  (currency) => currency.id === field.value
                                )?.code
                              : t("subscription.field.selectCurrency")}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {currencies.length === 0 ? (
                          <SelectItem key="0" value="0" disabled>
                            {t("common.empty")}
                          </SelectItem>
                        ) : (
                          currencies.map((currency) => (
                            <SelectItem
                              key={currency.id}
                              value={currency.id.toString()}
                            >
                              {currency.code}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subscription.field.category")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="site"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subscription.field.site")}</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://" {...field} />
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
