package ext

import "github.com/gogf/gf/v2/frame/g"

type PostBookmarkReq struct {
	g.Meta  `path:"/bookmark" method:"post" tags:"扩展管理" summary:"添加书签"`
	Content string   `json:"content" v:"required#bookmark.valid.ContentEmpty" dc:"内容"`
	Url     string   `json:"url" v:"required|url#bookmark.valid.UrlEmpty|bookmark.valid.UrlInvalid" dc:"url"`
	Title   string   `json:"title" v:"required#bookmark.valid.TitleEmpty" dc:"标题"`
	Labels  []string `json:"labels" dc:"标签"`
}
type PostBookmarkRes struct {
	g.Meta `mime:"application/json"`
}
