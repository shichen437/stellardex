"use client";

import { useEffect, useState } from "react";
import { createSSEConnection } from "@/lib/sse";
import { Cpu, MemoryStick, HardDrive } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { usePolyglot } from "@/providers/PolyglotProvider";
import { formatBytes } from "@/lib/utils";

type MonitorData = {
  cpu: {
    modelName: string;
    cores: number;
    percent: number;
  };
  mem: {
    total: number;
    used: number;
    available: number;
    usedPercent: number;
  };
  disk: {
    path: string;
    fstype: string;
    total: number;
    used: number;
    free: number;
    usedPercent: number;
  };
};

export default function MonitorPanel() {
  const [data, setData] = useState<MonitorData | null>(null);
  const { t } = usePolyglot();

  useEffect(() => {
    const sseClient = createSSEConnection({
      channel: "monitor",
      onMessage: (msg) => {
        if (msg.event === "monitor") {
          setData(() => {
            return msg.data;
          });
        }
      },
      onError: (error) => {
        console.error("Monitor SSE error:", error);
      },
    });

    return () => {
      sseClient.disconnect();
    };
  }, []);

  if (!data) {
    return null;
  }

  return (
    <div className="flex w-full max-w-3xl mx-auto px-2 sm:px-6 md:px-0 gap-4">
      <HoverCard>
        <HoverCardTrigger className="flex-1 flex items-center gap-1">
          <div className="flex-1 flex items-center gap-1">
            <span className="w-10">
              <Cpu />
            </span>
            <Progress value={data?.cpu.percent} max={100} />
          </div>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex flex-col gap-1">
            <h4 className="text-base">{t("monitor.cpu.title")}</h4>
            <span>
              {t("monitor.cpu.model")}: {data?.cpu.modelName}
            </span>
            <span>
              {t("monitor.cpu.cores")}: {data?.cpu.cores}
            </span>
            <span>
              {t("monitor.cpu.usage")}: {data?.cpu.percent.toFixed(2)}%
            </span>
          </div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger className="flex-1 flex items-center gap-1">
          <div className="flex-1 flex items-center gap-2">
            <span className="w-10">
              <MemoryStick />
            </span>
            <Progress value={data?.mem.usedPercent} max={100} />
          </div>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex flex-col gap-1">
            <h4 className="text-base">{t("monitor.memory.title")}</h4>
            <span>
              {t("monitor.memory.total")}: {formatBytes(data?.mem.total)}
            </span>
            <span>
              {t("monitor.memory.used")}: {formatBytes(data?.mem.used)}
            </span>
            <span>
              {t("monitor.memory.available")}:{" "}
              {formatBytes(data?.mem.available)}
            </span>
            <span>
              {t("monitor.memory.usage")}: {data?.mem.usedPercent.toFixed(2)}%
            </span>
          </div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger className="flex-1 flex items-center gap-1">
          <div className="flex-1 flex items-center gap-1">
            <span className="w-10">
              <HardDrive />
            </span>
            <Progress value={data?.disk.usedPercent} max={100} />
          </div>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex flex-col gap-1">
            <h4 className="text-base">{t("monitor.disk.title")}</h4>
            <span>
              {t("monitor.disk.path")}: {data?.disk.path}
            </span>
            <span>
              {t("monitor.disk.fstype")}: {data?.disk.fstype}
            </span>
            <span>
              {t("monitor.disk.total")}: {formatBytes(data?.disk.total)}
            </span>
            <span>
              {t("monitor.disk.used")}: {formatBytes(data?.disk.used)}
            </span>
            <span>
              {t("monitor.disk.free")}: {formatBytes(data?.disk.free)}
            </span>
            <span>
              {t("monitor.disk.usage")}: {data?.disk.usedPercent.toFixed(2)}%
            </span>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
