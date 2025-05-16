// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// UserGroup is the golang structure for table user_group.
type UserGroup struct {
	Id          int         `json:"id"          orm:"id"           description:""`
	UserId      int         `json:"userId"      orm:"user_id"      description:""`
	GroupName   string      `json:"groupName"   orm:"group_name"   description:""`
	DisplayType string      `json:"displayType" orm:"display_type" description:""`
	IsShow      int         `json:"isShow"      orm:"is_show"      description:""`
	OrderNum    int         `json:"orderNum"    orm:"order_num"    description:""`
	CreateAt    *gtime.Time `json:"createAt"    orm:"create_at"    description:""`
	UpdateAt    *gtime.Time `json:"updateAt"    orm:"update_at"    description:""`
}
