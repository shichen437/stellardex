import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Selector } from "@/lib/types/bookmark";
import { usePolyglot } from "@/providers/PolyglotProvider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Selector;
  onSubmit: (data: Selector) => void;
}

export function SelectorDialog({ open, onOpenChange, data, onSubmit }: Props) {
  const { t } = usePolyglot();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {formData.id > 0 ? t("bookmark.selector.edit") : t("bookmark.selector.add")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="domain" className="text-right">
                {t("bookmark.selector.fields.domain")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="domain"
                className="col-span-3"
                value={formData.domain}
                onChange={(e) =>
                  setFormData({ ...formData, domain: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cookie" className="text-right">
                {t("bookmark.selector.fields.cookie")}
              </Label>
              <Input
                id="cookie"
                className="col-span-3"
                value={formData.cookie}
                onChange={(e) =>
                  setFormData({ ...formData, cookie: e.target.value })
                }
              />
            </div>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            className="flex items-center justify-center gap-2"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? (
              <>
                {t("common.collapse")} <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                {t("common.expand")} <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>

          {showAdvanced && (
            <div className="grid gap-4 border rounded-lg p-4 bg-muted/50">
              {[
                { field: "title", label: t("bookmark.selector.fields.title") },
                { field: "content", label: t("bookmark.selector.fields.content") },
                { field: "byline", label: t("bookmark.selector.fields.byline") },
                { field: "excerpt", label: t("bookmark.selector.fields.excerpt") },
                { field: "publishedTime", label: t("bookmark.selector.fields.publishedTime") },
              ].map(({ field, label }) => (
                <div key={field} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field} className="text-right">
                    {label}
                  </Label>
                  <Input
                    id={field}
                    className="col-span-3"
                    value={formData[field as keyof Selector]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit}>{t("common.confirm")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}