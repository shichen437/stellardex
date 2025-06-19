// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SysApiKey is the golang structure for table sys_api_key.
type SysApiKey struct {
	Id         int         `json:"id"         orm:"id"           description:""`
	UserId     int         `json:"userId"     orm:"user_id"      description:""`
	ApiKey     string      `json:"apiKey"     orm:"api_key"      description:""`
	ApiKeyName string      `json:"apiKeyName" orm:"api_key_name" description:""`
	Status     int         `json:"status"     orm:"status"       description:""`
	ExpiresAt  *gtime.Time `json:"expiresAt"  orm:"expires_at"   description:""`
	CreateAt   *gtime.Time `json:"createAt"   orm:"create_at"    description:""`
	UpdateAt   *gtime.Time `json:"updateAt"   orm:"update_at"    description:""`
}
