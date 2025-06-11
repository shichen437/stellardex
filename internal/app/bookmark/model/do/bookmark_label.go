// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// BookmarkLabel is the golang structure of table bookmark_label for DAO operations like Where/Data.
type BookmarkLabel struct {
	g.Meta   `orm:"table:bookmark_label, do:true"`
	Id       interface{} //
	UserId   interface{} //
	Name     interface{} //
	CreateAt *gtime.Time //
	UpdateAt *gtime.Time //
}
