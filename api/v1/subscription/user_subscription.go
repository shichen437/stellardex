package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
	"github.com/shichen437/stellardex/api/v1/common"
	"github.com/shichen437/stellardex/internal/app/subscription/model"
)

type GetUserSubListReq struct {
	g.Meta `path:"/subscription/list" method:"get" tags:"用户订阅" summary:"获取用户订阅列表"`
	common.PageReq
}
type GetUserSubListRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Total  int               `json:"total"`
	Rows   []*model.SubModel `json:"rows"`
}

type GetSubTimelineReq struct {
	g.Meta `path:"/subscription/timeline" method:"get" tags:"用户订阅" summary:"获取用户订阅时间线"`
}
type GetSubTimelineRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Data   []*model.SubTimelineModel `json:"data"`
}

type GetSubOverviewReq struct {
	g.Meta `path:"/subscription/overview" method:"get" tags:"用户订阅" summary:"获取用户订阅概览"`
}
type GetSubOverviewRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Data   *model.SubOverviewModel `json:"data"`
}

type PostUserSubReq struct {
	g.Meta    `path:"/subscription" method:"post" tags:"用户订阅" summary:"创建用户订阅"`
	Title     string      `json:"title" v:"required|max-length:12#sub.valid.titleEmpty|sub.valid.titleLength"`
	Amount    float64     `json:"amount" v:"min:0#sub.valid.amount"`
	CycleNum  int         `json:"cycleNum" v:"between:1,99#sub.valid.cycleNum"`
	CycleType int         `json:"cycleType" v:"in:0,1,2,3,4#sub.valid.cycleType"`
	CycleDay  int         `json:"cycleDay" v:"in:0,1,2#sub.valid.cycleDay"`
	StartDate *gtime.Time `json:"startDate" v:"min-length:10#sub.valid.startDate"`
	Currency  int         `json:"currency" v:"min:1#sub.valid.currency"`
	Category  string      `json:"category" v:"max-length:12#sub.valid.categoryLength"`
	Site      string      `json:"site" v:"url#sub.valid.site"`
}
type PostUserSubRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type PutUserSubReq struct {
	g.Meta    `path:"/subscription" method:"put" tags:"用户订阅" summary:"更新用户订阅"`
	Id        int         `json:"id" v:"required#sub.valid.IdEmpty"`
	Title     string      `json:"title" v:"required|max-length:12#sub.valid.titleEmpty|sub.valid.titleLength"`
	Amount    float64     `json:"amount" v:"min:0#sub.valid.amount"`
	CycleNum  int         `json:"cycleNum" v:"between:1,99#sub.valid.cycleNum"`
	CycleType int         `json:"cycleType" v:"in:0,1,2,3,4#sub.valid.cycleType"`
	CycleDay  int         `json:"cycleDay" v:"in:0,1,2#sub.valid.cycleDay"`
	StartDate *gtime.Time `json:"startDate" v:"min-length:10#sub.valid.startDate"`
	Currency  int         `json:"currency" v:"min:1#sub.valid.currency"`
	Category  string      `json:"category" v:"max-length:12#sub.valid.categoryLength"`
	Site      string      `json:"site" v:"url#sub.valid.site"`
}
type PutUserSubRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type DeleteUserSubReq struct {
	g.Meta `path:"/subscription/{id}" method:"delete" tags:"用户订阅" summary:"删除用户订阅"`
	Id     int `json:"id" v:"required#sub.valid.IdEmpty"`
}
type DeleteUserSubRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type PutEnableUserSubReq struct {
	g.Meta `path:"/subscription/enable/{id}" method:"put" tags:"用户订阅" summary:"启用用户订阅"`
	Id     int `json:"id" v:"required#sub.valid.IdEmpty"`
}
type PutEnableUserSubRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type PutDisableUserSubReq struct {
	g.Meta `path:"/subscription/disable/{id}" method:"put" tags:"用户订阅" summary:"禁用用户订阅"`
	Id     int `json:"id" v:"required#sub.valid.IdEmpty"`
}
type PutDisableUserSubRes struct {
	g.Meta `mime:"application/json" example:"string"`
}
