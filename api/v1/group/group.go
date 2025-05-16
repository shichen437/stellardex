package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/internal/app/group/model/entity"
)

type GetGroupListReq struct {
	g.Meta `path:"/group/list" method:"get" tags:"分组管理" summary:"获取分组列表"`
}
type GetGroupListRes struct {
	g.Meta `mime:"application/json"`
	Rows   []*entity.UserGroup `json:"rows"`
}

type GetGroupReq struct {
	g.Meta `path:"/group/{id}" method:"get" tags:"分组管理" summary:"获取分组信息"`
	Id     int `v:"required" json:"id"`
}
type GetGroupRes struct {
	g.Meta `mime:"application/json"`
	*entity.UserGroup
}

type PostGroupReq struct {
	g.Meta      `path:"/group" method:"post" tags:"分组管理" summary:"创建分组"`
	Name        string `v:"required" json:"name"`
	DisplayType string `v:"required" json:"displayType"`
}
type PostGroupRes struct {
	g.Meta `mime:"application/json"`
}

type PutGroupReq struct {
	g.Meta      `path:"/group" method:"put" tags:"分组管理" summary:"修改分组"`
	Id          int    `v:"required" json:"id"`
	Name        string `v:"required" json:"name"`
	DisplayType string `v:"required" json:"displayType"`
}
type PutGroupRes struct {
	g.Meta `mime:"application/json"`
}

type DeleteGroupReq struct {
	g.Meta `path:"/group/{id}" method:"delete" tags:"分组管理" summary:"删除分组"`
	Id     int `v:"required" json:"id"`
}
type DeleteGroupRes struct {
	g.Meta `mime:"application/json"`
}

type PutGroupVisibleReq struct {
	g.Meta `path:"/group/isShow" method:"put" tags:"分组管理" summary:"修改分组可见性"`
	Id     int `v:"required" json:"id"`
	IsShow int `v:"required" json:"isShow"`
}
type PutGroupVisibleRes struct {
	g.Meta `mime:"application/json"`
}

type PutGroupOrderReq struct {
	g.Meta `path:"/group/sort" method:"put" tags:"分组管理" summary:"修改分组排序"`
	Groups []*GroupOrder `v:"required" json:"groups"`
}
type PutGroupOrderRes struct {
	g.Meta `mime:"application/json"`
}

type GroupOrder struct {
	Id       int `json:"id"`
	OrderNum int `json:"orderNum"`
}
