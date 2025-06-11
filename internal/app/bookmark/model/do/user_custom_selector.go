// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// UserCustomSelector is the golang structure of table user_custom_selector for DAO operations like Where/Data.
type UserCustomSelector struct {
	g.Meta        `orm:"table:user_custom_selector, do:true"`
	Id            interface{} //
	UserId        interface{} //
	Domain        interface{} //
	Title         interface{} //
	Byline        interface{} //
	Excerpt       interface{} //
	Content       interface{} //
	PublishedTime interface{} //
	Cookie        interface{} //
	CreateAt      *gtime.Time //
	UpdateAt      *gtime.Time //
}
