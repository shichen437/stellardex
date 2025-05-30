import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Sketch } from "@uiw/react-color";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GroupItem } from "@/lib/types/group";
import { getFaviconUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { postIcon } from "@/api/group_item";
import { PreviewCard } from "./PreviewCard";
import { PreviewIcon } from "./PreviewIcon";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface GroupItemModalProps {
  item?: GroupItem | null;
  onClose: () => void;
  onSubmit: (item: GroupItem) => void;
  currentGroupId: number;
}

export function GroupItemModal({
  item,
  onClose,
  onSubmit,
  currentGroupId,
}: GroupItemModalProps) {
  const { t } = usePolyglot();

  const groupItemFormSchema = z.object({
    title: z
      .string()
      .min(1, { message: t("groupItem.error.title") })
      .max(10, { message: t("groupItem.error.titleLimit") }),
    description: z
      .string()
      .max(30, { message: t("groupItem.error.descLimit") })
      .optional(),
    url: z
      .string()
      .min(1, { message: t("groupItem.error.url") })
      .url({ message: t("groupItem.error.urlValid") }),
    lanUrl: z
      .string()
      .url({ message: t("groupItem.error.lanUrlValid") })
      .optional()
      .or(z.literal("")),
    iconType: z.enum(["text", "image", "lucide", "local"]),
    iconUrl: z.string(),
    bgColor: z.string(),
    opacity: z.number().min(0).max(1),
  });
  type GroupItemFormValues = z.infer<typeof groupItemFormSchema>;
  const form = useForm<GroupItemFormValues>({
    resolver: zodResolver(groupItemFormSchema),
    defaultValues: {
      title: item?.title || "",
      description: item?.description || "",
      url: item?.url || "",
      lanUrl: item?.lanUrl || "",
      iconType: item?.iconType || "text",
      iconUrl:
        item?.iconUrl ||
        (item?.iconType === "text" && item?.title
          ? item.title.slice(0, 2)
          : ""),
      bgColor: item?.bgColor || "#ffffff",
      opacity: item?.opacity || 1,
    },
  });

  const watchedTitle = form.watch("title");
  const watchedDescription = form.watch("description");
  const watchedUrl = form.watch("url");
  const watchedIconType = form.watch("iconType");
  const watchedIconUrl = form.watch("iconUrl");
  const watchedBgColor = form.watch("bgColor");
  const watchedOpacity = form.watch("opacity");

  useEffect(() => {
    if (item) {
      form.reset({
        title: item.title || "",
        description: item.description || "",
        url: item.url || "",
        lanUrl: item.lanUrl || "",
        iconType: item.iconType || "text",
        iconUrl:
          item.iconUrl ||
          (item.iconType === "text" && item.title
            ? item.title.slice(0, 2)
            : ""),
        bgColor: item.bgColor || "#ffffff",
        opacity: item.opacity || 1,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        url: "",
        lanUrl: "",
        iconType: "text",
        iconUrl: "",
        bgColor: "#ffffff",
        opacity: 1,
      });
    }
  }, [item, form]);

  useEffect(() => {
    if (watchedIconType === "text" && watchedTitle) {
      form.setValue("iconUrl", watchedTitle.slice(0, 2));
    }
  }, [watchedIconType, watchedTitle, form]);

  const handleGetFavicon = () => {
    const currentUrl = form.getValues("url");
    try {
      const faviconUrl = getFaviconUrl(currentUrl);
      if (!faviconUrl) throw new Error("无效链接");
      form.setValue("iconType", "image");
      form.setValue("iconUrl", faviconUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const processFormSubmit = (data: GroupItemFormValues) => {
    const submittedItem: GroupItem = {
      id: item?.id ?? 0,
      groupId: item?.groupId ?? currentGroupId,
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      url: data.url.trim(),
      lanUrl: data.lanUrl?.trim() || undefined,
      iconType: data.iconType,
      iconUrl: data.iconUrl.trim(),
      bgColor: data.bgColor,
      opacity: data.opacity,
      orderNum: item?.orderNum || 0,
    };
    onSubmit(submittedItem);
  };

  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-popover dark:bg-popover rounded-lg shadow-xl w-full max-w-3xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">
          {item ? t("groupItem.edit") : t("groupItem.add")}
        </h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(processFormSubmit)}
            className="space-y-4"
          >
            <label className="block text-sm font-medium mb-3">
              {t("groupItem.preview")}
            </label>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
              <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-6">
                <div className="w-full sm:w-[280px]">
                  <PreviewCard
                    title={watchedTitle}
                    description={watchedDescription}
                    iconType={watchedIconType}
                    iconUrl={watchedIconUrl}
                    bgColor={watchedBgColor}
                    opacity={watchedOpacity}
                  />
                </div>
                <div className="w-[120px] flex flex-col items-center">
                  <PreviewIcon
                    iconType={watchedIconType}
                    iconUrl={watchedIconUrl}
                    title={watchedTitle}
                    bgColor={watchedBgColor}
                    opacity={watchedOpacity}
                  />
                  <span className="text-sm text-center truncate w-full text-gray-700 dark:text-gray-300">
                    {watchedTitle || t("groupItem.fields.title")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("groupItem.fields.title")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("groupItem.placeholder.title")}
                        {...field}
                        className="dark:bg-popover dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("groupItem.fields.desc")}</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder={t("groupItem.placeholder.desc")}
                          maxLength={30}
                          {...field}
                          className="dark:bg-popover dark:border-gray-600"
                        />
                      </FormControl>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                        {field.value?.length || 0}/30
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("groupItem.fields.url")}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type="url"
                        placeholder={t("groupItem.placeholder.url")}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value.trim()) {
                            form.clearErrors("url");
                          }
                        }}
                        className="flex-1 dark:bg-popover dark:border-gray-600"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={handleGetFavicon}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-popover dark:text-gray-300 dark:hover:bg-gray-600 rounded-md whitespace-nowrap"
                      disabled={!watchedUrl?.trim()}
                    >
                      {t("groupItem.getIcon")}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lanUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("groupItem.fields.lanUrl")}</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder={t("groupItem.placeholder.lanUrl")}
                      {...field}
                      className="dark:bg-popover dark:border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="iconType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("groupItem.fields.iconType")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value as GroupItem["iconType"]);
                        const newType = value as GroupItem["iconType"];
                        if (newType === "text") {
                          form.setValue(
                            "iconUrl",
                            form.getValues("title").slice(0, 2)
                          );
                        } else if (newType === "image") {
                          if (form.getValues("url").trim()) {
                            handleGetFavicon();
                          } else {
                            form.setValue("iconUrl", "");
                          }
                        } else if (newType === "lucide") {
                          form.setValue("iconUrl", "");
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full dark:bg-popover dark:border-gray-600">
                          <SelectValue
                            placeholder={t("groupItem.placeholder.iconType")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">
                          {t("groupItem.fields.iconType_text")}
                        </SelectItem>
                        <SelectItem value="lucide">
                          {t("groupItem.fields.iconType_lucide")}
                        </SelectItem>
                        <SelectItem value="local">
                          {t("groupItem.fields.iconType_local")}
                        </SelectItem>
                        <SelectItem value="image" disabled>
                          {t("groupItem.fields.iconType_online")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="flex-1">
                <FormLabel>{t("groupItem.fields.bgColor")}</FormLabel>
                <div className="flex items-start gap-2">
                  <div className="relative">
                    <Button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="w-10 h-10 rounded-md border dark:border-gray-600 overflow-hidden"
                      style={{
                        backgroundColor: watchedBgColor,
                        opacity: watchedOpacity,
                      }}
                    />
                    {showColorPicker && (
                      <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 z-20">
                        <Sketch
                          color={watchedBgColor}
                          onChange={(colorResult) => {
                            form.setValue("bgColor", colorResult.hex);
                            form.setValue(
                              "opacity",
                              colorResult.rgba.a !== undefined
                                ? Number(colorResult.rgba.a.toFixed(4))
                                : 1
                            );
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <FormField
                      control={form.control}
                      name="bgColor"
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="#ffffff"
                            className="flex-1 dark:bg-popover dark:border-gray-600"
                          />
                        </FormControl>
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        form.setValue("bgColor", "#ffffff");
                        form.setValue("opacity", 1);
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-popover dark:text-gray-300 dark:hover:bg-gray-600 rounded-md whitespace-nowrap"
                    >
                      {t("common.reset")}
                    </Button>
                  </div>
                </div>
                <FormMessage>
                  {form.formState.errors.bgColor?.message ||
                    form.formState.errors.opacity?.message}
                </FormMessage>
              </FormItem>
            </div>

            {watchedIconType !== "text" && (
              <FormField
                control={form.control}
                name="iconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {watchedIconType === "image" &&
                        t("groupItem.fields.imageUrl")}
                      {watchedIconType === "lucide" &&
                        t("groupItem.fields.lucide")}
                      {watchedIconType === "local" &&
                        t("groupItem.fields.local")}
                    </FormLabel>
                    <FormControl>
                      {watchedIconType === "local" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            onClick={() =>
                              document.getElementById("icon-upload")?.click()
                            }
                            variant="outline"
                            className="px-3 py-2"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {t("groupItem.fields.local")}
                          </Button>
                          <input
                            id="icon-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const formData = new FormData();
                                formData.append("icon", file);
                                try {
                                  const res = await postIcon(formData);
                                  form.setValue("iconUrl", res.data.iconUrl);
                                } catch (error) {
                                  console.error(error);
                                }
                              }
                            }}
                          />
                          <Input
                            value={field.value}
                            readOnly
                            className="flex-1 dark:bg-popover dark:border-gray-600"
                          />
                        </div>
                      ) : (
                        <Input
                          type={watchedIconType === "image" ? "url" : "text"}
                          placeholder={
                            watchedIconType === "image"
                              ? t("groupItem.placeholder.imageUrl")
                              : t("groupItem.placeholder.lucide")
                          }
                          {...field}
                          className="dark:bg-popover dark:border-gray-600"
                          disabled={
                            watchedIconType === "image" &&
                            form.getValues("url")?.trim() !== "" &&
                            getFaviconUrl(form.getValues("url")) === field.value
                          }
                        />
                      )}
                    </FormControl>
                    {watchedIconType === "lucide" && (
                      <FormDescription className="flex space-x-2">
                        <>
                          <a
                            href="https://lucide.dev/icons/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:underline"
                          >
                            Lucide Icons
                          </a>
                          <Separator orientation="vertical" />
                          <a
                            href="https://www.iconfont.cn/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:underline"
                          >
                            iconfont
                          </a>
                        </>
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="px-4 py-2 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 text-white rounded-md"
                disabled={form.formState.isSubmitting}
              >
                {t("common.confirm")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
