// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// UserGroupItem is the golang structure for table user_group_item.
type UserGroupItem struct {
	Id          int         `json:"id"          orm:"id"          description:""`
	GroupId     int         `json:"groupId"     orm:"group_id"    description:""`
	Title       string      `json:"title"       orm:"title"       description:""`
	Url         string      `json:"url"         orm:"url"         description:""`
	LanUrl      string      `json:"lanUrl"      orm:"lan_url"     description:""`
	Description string      `json:"description" orm:"description" description:""`
	IconType    string      `json:"iconType"    orm:"icon_type"   description:""`
	IconUrl     string      `json:"iconUrl"     orm:"icon_url"    description:""`
	BgColor     string      `json:"bgColor"     orm:"bg_color"    description:""`
	Opacity     float32     `json:"opacity"     orm:"opacity"     description:""`
	OrderNum    int         `json:"orderNum"    orm:"order_num"   description:""`
	CreateAt    *gtime.Time `json:"createAt"    orm:"create_at"   description:""`
	UpdateAt    *gtime.Time `json:"updateAt"    orm:"update_at"   description:""`
}
