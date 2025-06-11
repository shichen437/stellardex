// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// UserCustomSelector is the golang structure for table user_custom_selector.
type UserCustomSelector struct {
	Id            int         `json:"id"            orm:"id"             description:""`
	UserId        int         `json:"userId"        orm:"user_id"        description:""`
	Domain        string      `json:"domain"        orm:"domain"         description:""`
	Title         string      `json:"title"         orm:"title"          description:""`
	Byline        string      `json:"byline"        orm:"byline"         description:""`
	Excerpt       string      `json:"excerpt"       orm:"excerpt"        description:""`
	Content       string      `json:"content"       orm:"content"        description:""`
	PublishedTime string      `json:"publishedTime" orm:"published_time" description:""`
	Cookie        string      `json:"cookie"        orm:"cookie"         description:""`
	CreateAt      *gtime.Time `json:"createAt"      orm:"create_at"      description:""`
	UpdateAt      *gtime.Time `json:"updateAt"      orm:"update_at"      description:""`
}
