package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/api/v1/common"
	"github.com/shichen437/stellardex/internal/app/bookmark/model"
	"github.com/shichen437/stellardex/internal/app/bookmark/model/entity"
)

type PostBookmarkReq struct {
	g.Meta   `path:"/bookmark" method:"post" tags:"书签管理" summary:"添加书签"`
	Url      string   `v:"required|url#bookmark.valid.UrlEmpty|bookmark.valid.UrlInvalid" json:"url"`
	Title    string   `json:"title"`
	Labels   []string `json:"labels"`
	LabelIds []int    `json:"labelIds"`
}
type PostBookmarkRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type DeleteBookmarkReq struct {
	g.Meta `path:"/bookmark/{id}" method:"delete" tags:"书签管理" summary:"删除书签"`
	Id     int `v:"required#bookmark.valid.IdEmpty" json:"id"`
}
type DeleteBookmarkRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type GetBookmarkListReq struct {
	g.Meta `path:"/bookmark/list" method:"get" tags:"书签管理" summary:"获取书签列表"`
	common.PageReq
	Keyword   string `json:"keyword"`
	Author    string `json:"author"`
	Site      string `json:"site"`
	Sort      string `json:"sort"`
	Status    *int   `json:"status"`
	IsArchive *int   `json:"isArchive"`
	IsStarred *int   `json:"isStarred"`
	Label     string `json:"label"`
}
type GetBookmarkListRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Total  int                    `json:"total"`
	Rows   []*model.BookmarkModel `json:"rows"`
}

type GetBookmarkReq struct {
	g.Meta `path:"/bookmark/{id}" method:"get" tags:"书签管理" summary:"获取书签详情"`
	Id     int `v:"required#bookmark.valid.IdEmpty" json:"id"`
}
type GetBookmarkRes struct {
	g.Meta   `mime:"application/json" example:"string"`
	Bookmark *entity.UserBookmark `json:"bookmark"`
}

type PutBookmarkReq struct {
	g.Meta   `path:"/bookmark/{id}" method:"put" tags:"书签管理" summary:"更新书签"`
	Id       int      `v:"required#bookmark.valid.IdEmpty" json:"id"`
	Status   *int     `json:"status"`
	Label    []string `json:"label"`
	LabelIds []int    `json:"labelIds"`
}
type PutBookmarkRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type GetBookmarkNumReq struct {
	g.Meta `path:"/bookmark/num" method:"get" tags:"书签管理" summary:"获取书签数量"`
}
type GetBookmarkNumRes struct {
	g.Meta   `mime:"application/json" example:"string"`
	Total    int `json:"total"`
	Unread   int `json:"unread"`
	Read     int `json:"read"`
	Archive  int `json:"archive"`
	Star     int `json:"star"`
	Label    int `json:"label"`
	Selector int `json:"selector"`
}

type PutBookmarkTitleReq struct {
	g.Meta `path:"/bookmark/title" method:"put" tags:"书签管理" summary:"更新书签标题"`
	Id     int    `v:"required#bookmark.valid.IdEmpty" json:"id"`
	Title  string `v:"required|length:1,80#bookmark.valid.TitleEmpty|bookmark.valid.TitleLength" json:"title"`
}
type PutBookmarkTitleRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type PutBookmarkStatusReq struct {
	g.Meta `path:"/bookmark/status" method:"put" tags:"书签管理" summary:"修改状态"`
	Id     int `v:"required#bookmark.valid.IdEmpty" json:"id"`
	Status int `v:"required" json:"status"`
	Type   int `v:"required" json:"type"`
}
type PutBookmarkStatusRes struct {
	g.Meta `mime:"application/json" example:"string"`
}
