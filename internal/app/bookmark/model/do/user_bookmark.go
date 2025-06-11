// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// UserBookmark is the golang structure of table user_bookmark for DAO operations like Where/Data.
type UserBookmark struct {
	g.Meta        `orm:"table:user_bookmark, do:true"`
	Id            interface{} //
	UserId        interface{} //
	Author        interface{} //
	ContentHtml   interface{} //
	Excerpt       interface{} //
	PublishedAt   *gtime.Time //
	ReadingTime   interface{} //
	SourceUrl     interface{} //
	Title         interface{} //
	WordCount     interface{} //
	ContentText   interface{} //
	CoverImageUrl interface{} //
	SiteName      interface{} //
	Status        interface{} //
	IsArchive     interface{} //
	IsStarred     interface{} //
	CreateAt      *gtime.Time //
	UpdateAt      *gtime.Time //
}
