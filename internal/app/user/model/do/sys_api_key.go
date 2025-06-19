// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SysApiKey is the golang structure of table sys_api_key for DAO operations like Where/Data.
type SysApiKey struct {
	g.Meta     `orm:"table:sys_api_key, do:true"`
	Id         interface{} //
	UserId     interface{} //
	ApiKey     interface{} //
	ApiKeyName interface{} //
	Status     interface{} //
	ExpiresAt  *gtime.Time //
	CreateAt   *gtime.Time //
	UpdateAt   *gtime.Time //
}
