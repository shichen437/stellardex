// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SysUser is the golang structure for table sys_user.
type SysUser struct {
	Id       int         `json:"id"       orm:"id"        description:""`
	Username string      `json:"username" orm:"username"  description:""`
	Password string      `json:"password" orm:"password"  description:""`
	Nickname string      `json:"nickname" orm:"nickname"  description:""`
	Sex      int         `json:"sex"      orm:"sex"       description:""`
	Email    string      `json:"email"    orm:"email"     description:""`
	Mobile   string      `json:"mobile"   orm:"mobile"    description:""`
	Status   int         `json:"status"   orm:"status"    description:""`
	Avatar   string      `json:"avatar"   orm:"avatar"    description:""`
	CreateAt *gtime.Time `json:"createAt" orm:"create_at" description:""`
	UpdateAt *gtime.Time `json:"updateAt" orm:"update_at" description:""`
}
