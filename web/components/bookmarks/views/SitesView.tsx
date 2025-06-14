import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { type UserBmSite } from "@/lib/types/bookmark";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { getBookmarkSite } from "@/api/bookmark/bookmark";

interface Props {
  onSiteClick: (site: UserBmSite) => void;
}

export function SitesView({ onSiteClick }: Props) {
  const { t } = usePolyglot();
  const [sites, setSites] = useState<UserBmSite[]>([]);

  const fetchSites = async () => {
    try {
      const res = await getBookmarkSite();
      if (res.code === 0) {
        setSites(res.data.rows);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">{t("bookmark.fields.site")}</h2>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {sites && sites.length > 0 ? (
          sites.map((site) => (
            <Card
              key={site.siteName}
              className="p-6 hover:shadow-lg transition-shadow"
              onClick={() => onSiteClick(site)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{site.siteName}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {site.bmNum} {t("bookmark.label.count")}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Globe className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium mb-2">
              {t("bookmark.empty.sites.title")}
            </p>
            <p className="text-sm text-gray-400">
              {t("bookmark.empty.sites.description")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
