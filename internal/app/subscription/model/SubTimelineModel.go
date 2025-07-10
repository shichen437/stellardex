package model

import "github.com/gogf/gf/v2/os/gtime"

type SubTimelineModel struct {
	Title    string      `json:"title"`
	NextDate *gtime.Time `json:"nextDate"`
}
