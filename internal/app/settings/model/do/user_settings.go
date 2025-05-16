// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// UserSettings is the golang structure of table user_settings for DAO operations like Where/Data.
type UserSettings struct {
	g.Meta          `orm:"table:user_settings, do:true"`
	Id              interface{} //
	UserId          interface{} //
	InterfaceConfig interface{} //
	ModuleConfig    interface{} //
	SiteConfig      interface{} //
	GroupConfig     interface{} //
	CreateAt        *gtime.Time //
	UpdateAt        *gtime.Time //
}
