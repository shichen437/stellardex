package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/internal/app/group/model/entity"
)

type GetGroupItemListReq struct {
	g.Meta  `path:"/group/item/list" method:"get" tags:"项目管理" summary:"获取项目列表"`
	GroupId int `p:"groupId" v:"required#分组id不能为空"`
}
type GetGroupItemListRes struct {
	g.Meta `mime:"application/json"`
	Rows   []*entity.UserGroupItem `json:"rows"`
}

type PostGroupItemReq struct {
	g.Meta      `path:"/group/item" method:"post" tags:"项目管理" summary:"新增项目"`
	GroupId     int     `p:"groupId" v:"required#分组id不能为空"`
	Title       string  `p:"title" v:"required#项目名称不能为空"`
	Url         string  `p:"url" v:"required#项目url不能为空"`
	LanUrl      string  `p:"lanUrl"`
	Description string  `p:"description"`
	IconType    string  `p:"iconType" v:"required#项目iconType不能为空"`
	IconUrl     string  `p:"iconUrl"`
	BgColor     string  `p:"bgColor" v:"required#项目bgColor不能为空"`
	Opacity     float32 `p:"opacity" v:"required#项目opacity不能为空"`
}
type PostGroupItemRes struct {
	g.Meta `mime:"application/json"`
}

type GetGroupItemReq struct {
	g.Meta `path:"/group/item/{id}" method:"get" tags:"项目管理" summary:"获取项目"`
	Id     int `p:"id" v:"required#项目id不能为空"`
}
type GetGroupItemRes struct {
	g.Meta `mime:"application/json"`
	*entity.UserGroupItem
}

type PutGroupItemReq struct {
	g.Meta      `path:"/group/item" method:"put" tags:"项目管理" summary:"修改项目"`
	Id          int     `p:"id" v:"required#项目id不能为空"`
	GroupId     int     `p:"groupId" v:"required#分组id不能为空"`
	Title       string  `p:"title" v:"required#项目名称不能为空"`
	Url         string  `p:"url" v:"required#项目url不能为空"`
	LanUrl      string  `p:"lanUrl"`
	Description string  `p:"description"`
	IconType    string  `p:"iconType" v:"required#项目iconType不能为空"`
	IconUrl     string  `p:"iconUrl"`
	BgColor     string  `p:"bgColor" v:"required#项目bgColor不能为空"`
	Opacity     float32 `p:"opacity" v:"required#项目opacity不能为空"`
}
type PutGroupItemRes struct {
	g.Meta `mime:"application/json"`
}

type DeleteGroupItemReq struct {
	g.Meta `path:"/group/item/{id}" method:"delete" tags:"项目管理" summary:"删除项目"`
	Id     int `p:"id" v:"required#项目id不能为空"`
}
type DeleteGroupItemRes struct {
	g.Meta `mime:"application/json"`
}
