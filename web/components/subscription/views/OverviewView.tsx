import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subOverview, subTimeline } from "@/api/subscription/subscription";
import { getDefaultCurrency } from "@/api/subscription/currency";
import {
  SubOverview,
  SubTimeline,
  SubCurrency,
} from "@/lib/types/subscription";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { formatDate } from "@/lib/utils";

export const OverviewView = () => {
  const [overview, setOverview] = useState<SubOverview | null>(null);
  const [timeline, setTimeline] = useState<SubTimeline[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState<SubCurrency | null>(
    null
  );
  const { t } = usePolyglot();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, timelineRes, defaultCurrencyRes] =
          await Promise.all([
            subOverview(),
            subTimeline(),
            getDefaultCurrency(),
          ]);
        setOverview(overviewRes.data.data);
        setTimeline(timelineRes.data.data);
        setDefaultCurrency(defaultCurrencyRes.data.data);
      } catch (error) {
        console.error("获取数据失败：", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-semibold">
        {t("subscription.nav.overview")}
      </h2>
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("subscription.overview.totalNum")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("subscription.overview.activeNum")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.active || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("subscription.overview.perYearCost")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {defaultCurrency?.symbol || "$"}{" "}
              {overview?.perYearAmount || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("subscription.overview.perMonthCost")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {defaultCurrency?.symbol || "$"}{" "}
              {overview?.perMonthAmount || "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 时间轴 */}
      {timeline && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("subscription.overview.timeline")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2 -mx-2 px-2">
              <div className="min-w-max">
                <Timeline orientation="horizontal">
                  {timeline.map((item, index) => (
                    <TimelineItem
                      key={index}
                      title={item.title}
                      date={formatDate(item.nextDate, t("common.dateFormat"))}
                    />
                  ))}
                </Timeline>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
