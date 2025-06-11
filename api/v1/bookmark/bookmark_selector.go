package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/api/v1/common"
	"github.com/shichen437/stellardex/internal/app/bookmark/model/entity"
)

type GetBookmarkSelectorListReq struct {
	g.Meta `path:"/bookmark/selector/list" method:"get" tags:"自定义选择器管理" summary:"获取选择器列表"`
	common.PageReq
	Keyword string `json:"keyword"`
}
type GetBookmarkSelectorListRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Total  int                          `json:"total"`
	Rows   []*entity.UserCustomSelector `json:"rows"`
}

type GetBookmarkSelectorReq struct {
	g.Meta `path:"/bookmark/selector/{id}" method:"get" tags:"自定义选择器管理" summary:"获取选择器详情"`
	Id     int `v:"required#bookmark.selector.valid.IdEmpty" json:"id"`
}
type GetBookmarkSelectorRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Data   *entity.UserCustomSelector `json:"data"`
}

type PostBookmarkSelectorReq struct {
	g.Meta        `path:"/bookmark/selector" method:"post" tags:"自定义选择器管理" summary:"添加选择器"`
	Domain        string `v:"required|url#bookmark.selector.valid.DomainEmpty|bookmark.selector.valid.DomainInvalid" json:"domain"`
	Title         string `json:"title"`
	Content       string `json:"content"`
	Byline        string `json:"byline"`
	Excerpt       string `json:"excerpt"`
	PublishedTime string `json:"published_time"`
	Cookie        string `json:"cookie"`
}
type PostBookmarkSelectorRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type PutBookmarkSelectorReq struct {
	g.Meta        `path:"/bookmark/selector" method:"put" tags:"自定义选择器管理" summary:"更新选择器"`
	Id            int    `v:"required#bookmark.selector.valid.IdEmpty" json:"id"`
	Domain        string `v:"required|url#bookmark.selector.valid.DomainEmpty|bookmark.selector.valid.DomainInvalid" json:"domain"`
	Title         string `json:"title"`
	Content       string `json:"content"`
	Byline        string `json:"byline"`
	Excerpt       string `json:"excerpt"`
	PublishedTime string `json:"published_time"`
	Cookie        string `json:"cookie"`
}
type PutBookmarkSelectorRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type DeleteBookmarkSelectorReq struct {
	g.Meta `path:"/bookmark/selector/{id}" method:"delete" tags:"自定义选择器管理" summary:"删除选择器"`
	Id     int `v:"required#bookmark.selector.valid.IdEmpty" json:"id"`
}
type DeleteBookmarkSelectorRes struct {
	g.Meta `mime:"application/json" example:"string"`
}
