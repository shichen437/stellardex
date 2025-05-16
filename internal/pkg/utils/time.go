package utils

import "github.com/gogf/gf/v2/os/gtime"

func Now() *gtime.Time {
	return gtime.NewFromStrFormat(gtime.Now().Local().Format("Y-m-d H:i:s"), "Y-m-d H:i:s")
}
