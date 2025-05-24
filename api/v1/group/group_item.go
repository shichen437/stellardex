package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/shichen437/stellardex/internal/app/group/model/entity"
)

type GetGroupItemListReq struct {
	g.Meta  `path:"/group/item/list" method:"get" tags:"项目管理" summary:"获取项目列表"`
	GroupId int `p:"groupId" v:"required#group.valid.GroupIdEmpty"`
}
type GetGroupItemListRes struct {
	g.Meta `mime:"application/json"`
	Rows   []*entity.UserGroupItem `json:"rows"`
}

type PostGroupItemReq struct {
	g.Meta      `path:"/group/item" method:"post" tags:"项目管理" summary:"新增项目"`
	GroupId     int     `p:"groupId" v:"required#group.valid.GroupIdEmpty" json:"groupId"`
	Title       string  `p:"title" v:"required|length:1,10#groupItem.valid.TitleEmpty|groupItem.valid.TitleLength" json:"title"`
	Url         string  `p:"url" v:"required|url#groupItem.valid.UrlEmpty|groupItem.valid.UrlFormat" json:"url"`
	LanUrl      string  `p:"lanUrl" v:"url#groupItem.valid.LanUrlFormat" json:"lanUrl"`
	Description string  `p:"description" v:"max-length:30#groupItem.valid.DescMaxLength" json:"description"`
	IconType    string  `p:"iconType" v:"required#groupItem.valid.IconTypeEmpty"`
	IconUrl     string  `p:"iconUrl"`
	BgColor     string  `p:"bgColor" v:"required#groupItem.valid.BgColorEmpty"`
	Opacity     float32 `p:"opacity" v:"required#groupItem.valid.OpacityEmpty"`
}
type PostGroupItemRes struct {
	g.Meta `mime:"application/json"`
}

type GetGroupItemReq struct {
	g.Meta `path:"/group/item/{id}" method:"get" tags:"项目管理" summary:"获取项目"`
	Id     int `p:"id" v:"required#groupItem.valid.GroupItemIdEmpty"`
}
type GetGroupItemRes struct {
	g.Meta `mime:"application/json"`
	*entity.UserGroupItem
}

type PutGroupItemReq struct {
	g.Meta      `path:"/group/item" method:"put" tags:"项目管理" summary:"修改项目"`
	Id          int     `p:"id" v:"required#groupItem.valid.GroupItemIdEmpty"`
	GroupId     int     `p:"groupId" v:"required#group.valid.GroupIdEmpty" json:"groupId"`
	Title       string  `p:"title" v:"required|length:1,10#groupItem.valid.TitleEmpty|groupItem.valid.TitleLength" json:"title"`
	Url         string  `p:"url" v:"required|url#groupItem.valid.UrlEmpty|groupItem.valid.UrlFormat" json:"url"`
	LanUrl      string  `p:"lanUrl" v:"url#groupItem.valid.LanUrlFormat" json:"lanUrl"`
	Description string  `p:"description" v:"max-length:30#groupItem.valid.DescMaxLength" json:"description"`
	IconType    string  `p:"iconType" v:"required#groupItem.valid.IconTypeEmpty"`
	IconUrl     string  `p:"iconUrl"`
	BgColor     string  `p:"bgColor" v:"required#groupItem.valid.BgColorEmpty"`
	Opacity     float32 `p:"opacity" v:"required#groupItem.valid.OpacityEmpty"`
}
type PutGroupItemRes struct {
	g.Meta `mime:"application/json"`
}

type DeleteGroupItemReq struct {
	g.Meta `path:"/group/item/{id}" method:"delete" tags:"项目管理" summary:"删除项目"`
	Id     int `p:"id" v:"required#groupItem.valid.GroupItemIdEmpty"`
}
type DeleteGroupItemRes struct {
	g.Meta `mime:"application/json"`
}

type PostLocalIconReq struct {
	g.Meta `path:"/group/item/icon" method:"post" tags:"项目管理" summary:"本地图标上传"`
	Icon   *ghttp.UploadFile `v:"required#groupItem.valid.FileEmpty" json:"icon" type:"file"`
}
type PostLocalIconRes struct {
	g.Meta  `mime:"application/json"`
	IconUrl string `json:"iconUrl"`
}
