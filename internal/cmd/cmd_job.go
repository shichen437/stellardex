package cmd

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gctx"
	"github.com/shichen437/stellardex/internal/pkg/cron"
)

func JobInit() {
	g.Log().Info(gctx.GetInitCtx(), "Job server initing...")
	cron.SystemCron(gctx.GetInitCtx())
	g.Log().Info(gctx.GetInitCtx(), "Job server init done")
}
