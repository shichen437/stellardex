// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// UserImg is the golang structure of table user_img for DAO operations like Where/Data.
type UserImg struct {
	g.Meta   `orm:"table:user_img, do:true"`
	Id       interface{} //
	Url      interface{} //
	Type     interface{} //
	UserId   interface{} //
	CreateAt *gtime.Time //
	UpdateAt *gtime.Time //
}
