/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, use } from "react";
import {
  Archive,
  CircleCheck,
  Clock,
  Link,
  Plus,
  Star,
  Tag,
  User,
  X,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getBookmark } from "@/api/bookmark/bookmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSettingsStore } from "@/lib/store/settings";
import { ThemeProvider } from "@/providers/ThemeProvider";
import {
  getBmLabels,
  saveBmLabel,
  deleteBmLabel,
  getUserBmLabels,
} from "@/api/bookmark/bookmark_label";
import { updateStatus, updateBmTitle } from "@/api/bookmark/bookmark";
import { Separator } from "@/components/ui/separator";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { Bookmark, Label, UserLabel } from "@/lib/types/bookmark";

function GlobalAuthListener() {
  useAuth();
  return null;
}

export default function BookmarkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = usePolyglot();
  const router = useRouter();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const settings = useSettingsStore((state) => state.settings);
  const getSettings = useSettingsStore((state) => state.getSettings);
  const [labels, setLabels] = useState<Label[]>([]);
  const [userLabels, setUserLabels] = useState<UserLabel[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(bookmark?.title || "");

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        const res = await getBookmark(Number(id));
        if (res.code === 0) {
          setBookmark(res.data.bookmark);
        } else {
          toast.error(res.msg);
        }
      } catch (error) {
        console.error("Loading bookmark failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmark();
  }, [id]);

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  useEffect(() => {
    if (bookmark) {
      setEditedTitle(bookmark.title);
      document.title = bookmark.title;
    }
  }, [bookmark]);

  const handleTitleUpdate = async () => {
    if (!bookmark || !editedTitle.trim()) return;

    try {
      const res = await updateBmTitle({
        id: bookmark.id,
        title: editedTitle,
      });

      if (res.code === 0) {
        setBookmark((prev) => (prev ? { ...prev, title: editedTitle } : null));
        setIsEditingTitle(false);
        toast.success(t("toast.success"));
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error("Updating title failed", error);
      toast.error(t("toast.error"));
    }
  };

  const handleUpdateStatus = async (data: {
    id?: number;
    status: number;
    type: number;
  }) => {
    const res = await updateStatus(data);
    if (res.code === 0) {
      setBookmark((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: data.type === 0 ? data.status : prev.status,
          isArchive: data.type === 1 ? data.status : prev.isArchive,
          isStarred: data.type === 2 ? data.status : prev.isStarred,
        };
      });
    } else {
      toast.error(res.msg);
    }
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdateStatus({
      id: bookmark?.id,
      status: bookmark?.status ? 0 : 1,
      type: 0,
    });
  };

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdateStatus({
      id: bookmark?.id,
      status: bookmark?.isArchive ? 0 : 1,
      type: 1,
    });
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdateStatus({
      id: bookmark?.id,
      status: bookmark?.isStarred ? 0 : 1,
      type: 2,
    });
  };

  useEffect(() => {
    const loadLabels = async () => {
      try {
        const res = await getBmLabels(Number(id));
        if (res.code === 0) {
          setLabels(res.data.rows);
        }
      } catch (error) {
        console.error("Loading labels failed", error);
      }
    };
    if (bookmark) {
      loadLabels();
    }
  }, [id, bookmark]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim()) {
      try {
        const res = await getUserBmLabels();
        if (res.code === 0) {
          setUserLabels(
            res.data.rows.filter((label: UserLabel) =>
              label.name.toLowerCase().includes(value.toLowerCase())
            )
          );
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Loading failed", error);
      }
    } else {
      setShowDropdown(false);
    }
  };

  const handleAddLabel = async (labelId?: number) => {
    if (!inputValue.trim()) return;
    try {
      const res = await saveBmLabel({
        id: id,
        labelName: labelId ? undefined : inputValue,
        labelId: labelId,
      });
      if (res.code === 0) {
        const labelsRes = await getBmLabels(Number(id));
        if (labelsRes.code === 0) {
          setLabels(labelsRes.data.rows);
        }
        setInputValue("");
        setShowDropdown(false);
        toast.success(t("toast.success"));
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLabel = async (labelId: number) => {
    try {
      const res = await deleteBmLabel(Number(id), labelId);
      if (res.code === 0) {
        setLabels(labels.filter((label) => label.id !== labelId));
        toast.success(t("toast.success"));
      }
    } catch (error) {
      toast.error(t("toast.error"));
    }
  };

  const prefix = process.env.NEXT_PUBLIC_API_PREFIX;

  const processImageUrls = (html: string) => {
    return html.replace(/<img[^>]*src="([^"]+)"[^>]*>/g, (match, src) => {
      console.log(src)
      if (src.startsWith("http")) return match;
      const newSrc = `${prefix}${src}`;
      return match.replace(src, newSrc);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bookmark) {
    return (
      <div className="min-h-screen bg-[#fafbfc] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">书签不存在</h1>
            <Button onClick={() => router.back()}>返回</Button>
          </div>
        </div>
      </div>
    );
  }

  const processedContent = bookmark
    ? processImageUrls(bookmark.contentHtml)
    : "";

  return (
    <ThemeProvider settings={settings}>
      <GlobalAuthListener />
      <div className="min-h-screen bg-popover flex">
        <div className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-2 py-8">
            <div className="mb-8">
              <div className="flex items-start gap-4">
                {isEditingTitle ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-3xl font-bold"
                    />
                    <Button onClick={handleTitleUpdate} size="sm">
                      {t("common.save")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditedTitle(bookmark.title);
                        setIsEditingTitle(false);
                      }}
                      size="sm"
                    >
                      {t("common.cancel")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold flex-1">
                      {bookmark.title}
                    </h1>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingTitle(true)}
                      className="text-muted-foreground"
                    >
                      <Edit />
                    </Button>
                  </>
                )}
              </div>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed border-l-4 border-gray-200 pl-4">
                {bookmark.excerpt}
              </p>
            </div>
            <div
              ref={contentRef}
              className="prose prose-slate dark:prose-dark prose-img:rounded-xl prose-headings:underline prose-a:text-blue-600 max-w-none"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
            <Separator />
            <div className="flex items-center gap-4 justify-center p-4">
              <div
                onClick={handleStatusClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-muted-foreground cursor-pointer hover:bg-muted"
              >
                <CircleCheck
                  className="w-5 h-5 text-muted-foreground"
                  fill={bookmark.status ? "yellow" : "none"}
                />
                <span>
                  {bookmark.status
                    ? t("bookmark.operation.unread")
                    : t("bookmark.operation.read")}
                </span>
              </div>
              <div
                onClick={handleStarClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-muted-foreground cursor-pointer hover:bg-muted"
              >
                <Star
                  className="w-5 h-5 text-muted-foreground"
                  fill={bookmark.isStarred ? "yellow" : "none"}
                />
                <span>
                  {bookmark.isStarred
                    ? t("bookmark.operation.unstar")
                    : t("bookmark.operation.star")}
                </span>
              </div>
              <div
                onClick={handleArchiveClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-muted-foreground cursor-pointer hover:bg-muted"
              >
                <Archive
                  className="w-5 h-5 text-muted-foreground"
                  fill={bookmark.isArchive ? "yellow" : "none"}
                />
                <span>
                  {bookmark.isArchive
                    ? t("bookmark.operation.unArchive")
                    : t("bookmark.operation.archive")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-70 bg-popover border-l flex flex-col p-6 sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-6">
            {bookmark.author && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <div>
                  <p className="text-sm">{bookmark.author}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Link className="w-5 h-5" />
              <div>
                <a
                  href={bookmark.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                >
                  {bookmark.siteName}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" />
              <div>
                <p className="text-sm">
                  {bookmark.readingTime} {t("common.minutes")}
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5" />
                <p className="text-sm font-medium">
                  {t("bookmark.label.title")}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {labels?.map((label) => (
                  <div key={label.id} className="group relative">
                    <Badge variant="secondary" className="pr-6">
                      {label.name}
                    </Badge>
                    <button
                      onClick={() => handleDeleteLabel(label.id)}
                      className="absolute -right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center w-4 h-4 bg-gray-500 rounded-full"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={t("bookmark.label.placeholder.add")}
                    className="text-sm"
                  />
                  <button
                    onClick={() => handleAddLabel()}
                    className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute bg-popover z-10 w-full mt-1 border rounded-md shadow-lg"
                  >
                    {userLabels.map((label) => (
                      <div
                        key={label.id}
                        className="px-3 py-2 bg-popover hover:bg-gray-200 dark:hover:bg-zinc-700/50 cursor-pointer text-sm"
                        onClick={() => handleAddLabel(label.id)}
                      >
                        {label.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
