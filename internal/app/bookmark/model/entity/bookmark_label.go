// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// BookmarkLabel is the golang structure for table bookmark_label.
type BookmarkLabel struct {
	Id       int         `json:"id"       orm:"id"        description:""`
	UserId   int         `json:"userId"   orm:"user_id"   description:""`
	Name     string      `json:"name"     orm:"name"      description:""`
	CreateAt *gtime.Time `json:"createAt" orm:"create_at" description:""`
	UpdateAt *gtime.Time `json:"updateAt" orm:"update_at" description:""`
}
