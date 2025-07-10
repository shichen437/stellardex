package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/api/v1/common"
	"github.com/shichen437/stellardex/internal/app/notification/model/entity"
)

type GetNotificationListReq struct {
	g.Meta `path:"/notification/list" method:"get" tags:"通知管理" summary:"获取通知列表"`
	common.PageReq
	Status *int `json:"status"`
	Type   *int `json:"type"`
}
type GetNotificationListRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Total  int                `json:"total"`
	Rows   []entity.SysNotify `json:"rows"`
}

type GetUnreadNotificationReq struct {
	g.Meta `path:"/notification/unread" method:"get" tags:"通知管理" summary:"获取未读通知"`
}
type GetUnreadNotificationRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Num    int                `json:"num"`
	Rows   []entity.SysNotify `json:"rows"`
}

type PutAllNotificationReadReq struct {
	g.Meta `path:"/notification/read" method:"put" tags:"通知管理" summary:"一键已读"`
}
type PutAllNotificationReadRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type DeleteNotificationReq struct {
	g.Meta `path:"/notification/{id}" method:"delete" tags:"通知管理" summary:"删除通知"`
	Id     int `json:"id" v:"required#通知ID不能为空"`
}
type DeleteNotificationRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type DeleteAllNotificationReq struct {
	g.Meta `path:"/notification/all" method:"delete" tags:"通知管理" summary:"删除所有通知"`
}
type DeleteAllNotificationRes struct {
	g.Meta `mime:"application/json" example:"string"`
}
