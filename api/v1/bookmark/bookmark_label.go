package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/internal/app/bookmark/model"
	"github.com/shichen437/stellardex/internal/app/bookmark/model/entity"
)

type GetBookmarkLabelsReq struct {
	g.Meta `path:"/bookmark/labels/{id}" method:"get" tags:"书签管理" summary:"获取书签标签列表"`
	Id     int `v:"required#bookmark.valid.IdEmpty" json:"id"`
}
type GetBookmarkLabelsRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Rows   []*entity.BookmarkLabel `json:"rows"`
}

type PostBookmarkLabelReq struct {
	g.Meta    `path:"/bookmark/label" method:"post" tags:"书签管理" summary:"添加书签标签"`
	Id        int    `v:"required#bookmark.valid.IdEmpty" json:"id"`
	LabelName string `v:"max-length:12#bookmark.label.valid.NameLength" json:"labelName"`
	LabelId   *int   `v:"required-without:LabelName#bookmark.label.valid.IdEmpty" json:"labelId"`
}
type PostBookmarkLabelRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type DeleteBookmarkLabelReq struct {
	g.Meta  `path:"/bookmark/label/{id}" method:"delete" tags:"书签管理" summary:"删除书签标签"`
	Id      int `v:"required#bookmark.valid.IdEmpty" json:"id"`
	LabelId int `v:"required#bookmark.label.valid.IdEmpty" json:"labelId"`
}
type DeleteBookmarkLabelRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type GetUserBookmarkLabelReq struct {
	g.Meta  `path:"/bookmark/user/labels" method:"get" tags:"书签管理" summary:"获取用户标签"`
	Keyword string `json:"keyword"`
}
type GetUserBookmarkLabelRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Rows   []*model.UserBmLabelModel `json:"rows"`
}

type PostUserBookmarkLabelReq struct {
	g.Meta `path:"/bookmark/user/label" method:"post" tags:"书签管理" summary:"添加用户书签标签"`
	Name   string `v:"required|length:1,12#bookmark.label.valid.NameEmpty|bookmark.label.valid.NameLength" json:"name"`
}
type PostUserBookmarkLabelRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type PutUserBookmarkLabelReq struct {
	g.Meta `path:"/bookmark/user/label" method:"put" tags:"书签管理" summary:"修改用户书签标签"`
	Id     int    `v:"required#bookmark.label.valid.IdEmpty" json:"id"`
	Name   string `v:"required|length:1,12#bookmark.label.valid.NameEmpty|bookmark.label.valid.NameLength" json:"name"`
}

type PutUserBookmarkLabelRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type DeleteUserBookmarkLabelReq struct {
	g.Meta `path:"/bookmark/user/label/{id}" method:"delete" tags:"书签管理" summary:"删除用户书签标签"`
	Id     int `v:"required#bookmark.label.valid.IdEmpty" json:"id"`
}
type DeleteUserBookmarkLabelRes struct {
	g.Meta `mime:"application/json" example:"string"`
}
