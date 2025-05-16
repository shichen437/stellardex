// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// UserSettings is the golang structure for table user_settings.
type UserSettings struct {
	Id              int         `json:"id"              orm:"id"               description:""`
	UserId          int         `json:"userId"          orm:"user_id"          description:""`
	InterfaceConfig string      `json:"interfaceConfig" orm:"interface_config" description:""`
	ModuleConfig    string      `json:"moduleConfig"    orm:"module_config"    description:""`
	SiteConfig      string      `json:"siteConfig"      orm:"site_config"      description:""`
	GroupConfig     string      `json:"groupConfig"     orm:"group_config"     description:""`
	CreateAt        *gtime.Time `json:"createAt"        orm:"create_at"        description:""`
	UpdateAt        *gtime.Time `json:"updateAt"        orm:"update_at"        description:""`
}
