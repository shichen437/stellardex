package system

import (
	"context"

	"github.com/gogf/gf/v2/util/gconv"
	"github.com/shichen437/stellardex/internal/pkg/monitor/entity"
	"github.com/shichen437/stellardex/internal/pkg/utils"
	"github.com/shirou/gopsutil/v3/disk"
)

func CheckStorage(ctx context.Context) {
	var diskData *entity.DiskInfo
	diskInfo, err := disk.Usage("/")
	if err != nil || diskInfo == nil {
		return
	}
	gconv.Struct(diskInfo, &diskData)
	if diskData.UsedPercent > 85 {
		utils.SendNotification(ctx,
			utils.T(ctx, "storage.notify.title"),
			utils.Tf(ctx, "storage.notify.content", diskData.UsedPercent), 1, 0)
	}
}
