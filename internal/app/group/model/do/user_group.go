// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// UserGroup is the golang structure of table user_group for DAO operations like Where/Data.
type UserGroup struct {
	g.Meta      `orm:"table:user_group, do:true"`
	Id          interface{} //
	UserId      interface{} //
	GroupName   interface{} //
	DisplayType interface{} //
	IsShow      interface{} //
	OrderNum    interface{} //
	CreateAt    *gtime.Time //
	UpdateAt    *gtime.Time //
}
