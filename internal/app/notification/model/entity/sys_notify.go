// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SysNotify is the golang structure for table sys_notify.
type SysNotify struct {
	Id       int         `json:"id"       orm:"id"        description:""`
	UserId   int         `json:"userId"   orm:"user_id"   description:""`
	Title    string      `json:"title"    orm:"title"     description:""`
	Content  string      `json:"content"  orm:"content"   description:""`
	Type     int         `json:"type"     orm:"type"      description:""`
	Status   int         `json:"status"   orm:"status"    description:""`
	CreateAt *gtime.Time `json:"createAt" orm:"create_at" description:""`
	UpdateAt *gtime.Time `json:"updateAt" orm:"update_at" description:""`
}
