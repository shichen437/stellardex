// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// UserImg is the golang structure for table user_img.
type UserImg struct {
	Id       int         `json:"id"       orm:"id"        description:""`
	Url      string      `json:"url"      orm:"url"       description:""`
	Type     string      `json:"type"     orm:"type"      description:""`
	UserId   int         `json:"userId"   orm:"user_id"   description:""`
	CreateAt *gtime.Time `json:"createAt" orm:"create_at" description:""`
	UpdateAt *gtime.Time `json:"updateAt" orm:"update_at" description:""`
}
