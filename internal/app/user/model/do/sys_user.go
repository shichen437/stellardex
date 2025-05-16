// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SysUser is the golang structure of table sys_user for DAO operations like Where/Data.
type SysUser struct {
	g.Meta   `orm:"table:sys_user, do:true"`
	Id       interface{} //
	Username interface{} //
	Password interface{} //
	Nickname interface{} //
	Sex      interface{} //
	Email    interface{} //
	Mobile   interface{} //
	Status   interface{} //
	Avatar   interface{} //
	CreateAt *gtime.Time //
	UpdateAt *gtime.Time //
}
