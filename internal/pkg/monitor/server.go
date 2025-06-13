package monitor

import (
	"time"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/util/gconv"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"

	"github.com/shichen437/stellardex/internal/pkg/consts"
	"github.com/shichen437/stellardex/internal/pkg/monitor/entity"
	"github.com/shichen437/stellardex/internal/pkg/sse"
)

type MonitorHandler struct{}

func (h *MonitorHandler) OnConnect(channel string) {
	sse.StartAutoSend(channel, 2*time.Second, HardwareInfo)
}

func (h *MonitorHandler) OnDisconnect(channel string) {
	sse.StopAutoSend(channel)
}

func init() {
	sse.RegisterChannelHandler(consts.SSE_CHANNEL_MONITOR, &MonitorHandler{})
}

func HardwareInfo() {
	cpuInfo, _ := cpu.Info()
	percents, _ := cpu.Percent(1000*time.Millisecond, false)
	var cpuData *entity.CpuInfo
	if len(cpuInfo) > 0 {
		gconv.Struct(cpuInfo[0], &cpuData)
		if len(percents) > 0 {
			cpuData.Percent = percents[0]
		}
	}
	var memData *entity.MemoryInfo
	memInfo, _ := mem.VirtualMemory()
	if memInfo != nil {
		gconv.Struct(memInfo, &memData)
	}
	var diskData *entity.DiskInfo
	diskInfo, _ := disk.Usage("/")
	if diskInfo != nil {
		gconv.Struct(diskInfo, &diskData)
	}
	msg := sse.GetSseMsgStr(consts.SSE_EVENT_TYPE_MONITOR, g.Map{
		"cpu":  cpuData,
		"mem":  memData,
		"disk": diskData,
	})
	sse.BroadcastMessage(consts.SSE_CHANNEL_MONITOR, msg)
}
