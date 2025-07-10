// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SysNotify is the golang structure of table sys_notify for DAO operations like Where/Data.
type SysNotify struct {
	g.Meta   `orm:"table:sys_notify, do:true"`
	Id       interface{} //
	UserId   interface{} //
	Title    interface{} //
	Content  interface{} //
	Type     interface{} //
	Status   interface{} //
	CreateAt *gtime.Time //
	UpdateAt *gtime.Time //
}
