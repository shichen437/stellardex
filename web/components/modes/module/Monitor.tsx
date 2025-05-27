"use client";

import { useEffect, useState } from "react";
import { createSSEConnection } from "@/lib/sse";
import { Progress } from "@/components/ui/progress";

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

  return (
    <div className="flex w-full max-w-3xl mx-auto px-2 sm:px-6 md:px-0 gap-4">
      <div className="flex-1 flex items-center gap-1">
        <span className="w-16">CPU</span>
        <Progress value={data?.cpu.percent} />
      </div>
      <div className="flex-1 flex items-center gap-2">
        <span className="w-16">Mem</span>
        <Progress value={data?.mem.usedPercent} />
      </div>
      <div className="flex-1 flex items-center gap-1">
        <span className="w-16">Disk</span>
        <Progress value={data?.disk.usedPercent} />
      </div>
    </div>
  );
}
