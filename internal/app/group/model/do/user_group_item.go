// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// UserGroupItem is the golang structure of table user_group_item for DAO operations like Where/Data.
type UserGroupItem struct {
	g.Meta      `orm:"table:user_group_item, do:true"`
	Id          interface{} //
	GroupId     interface{} //
	Title       interface{} //
	Url         interface{} //
	LanUrl      interface{} //
	Description interface{} //
	IconType    interface{} //
	IconUrl     interface{} //
	BgColor     interface{} //
	Opacity     interface{} //
	OrderNum    interface{} //
	CreateAt    *gtime.Time //
	UpdateAt    *gtime.Time //
}
