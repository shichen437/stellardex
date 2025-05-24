package cron

import (
	"context"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gcron"
	"github.com/shichen437/stellardex/internal/pkg/cron/system"
)

var (
	unusedIconClean = "unusedIconClean"
)

func SystemCron(ctx context.Context) {
	gcron.Add(ctx, "@midnight", func(ctx context.Context) {
		g.Log().Info(ctx, "Add job - "+unusedIconClean)
		system.CleanIcon(ctx)
	}, unusedIconClean)
}
