import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Group } from "@/lib/types/group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface GroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (group: {
    id?: number;
    name: string;
    displayType: Group["displayType"];
  }) => void;
  initialName?: string;
  initialStyle?: Group["displayType"];
  editing?: boolean;
  editingId?: number;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  open,
  onOpenChange,
  onSave,
  initialName = "",
  initialStyle = "details",
  editing = false,
  editingId,
}) => {
  const { t } = usePolyglot();

  const formSchema = z.object({
    name: z.string().min(1, t("groups.error.name")),
    displayType: z.enum(["details", "icons", "titles"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
      displayType: initialStyle,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialName,
        displayType: initialStyle,
      });
    }
  }, [open, initialName, initialStyle, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      id: editing ? editingId : undefined,
      name: values.name.trim(),
      displayType: values.displayType,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xs w-full rounded-xl shadow-2xl p-8 bg-popover dark:bg-popover"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {editing ? t("groups.edit") : t("groups.add")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("groups.groupName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("groups.placeholder.groupName")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("groups.showType")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("groups.placeholder.displayType")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="details">
                        {t("groups.showType_detail")}
                      </SelectItem>
                      <SelectItem value="icons">
                        {t("groups.showType_icon")}
                      </SelectItem>
                      <SelectItem value="titles">
                        {t("groups.showType_title")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="!mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit">
                {editing ? t("common.save") : t("common.confirm")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
