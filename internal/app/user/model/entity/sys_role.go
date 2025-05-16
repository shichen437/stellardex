// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SysRole is the golang structure for table sys_role.
type SysRole struct {
	Id         int         `json:"id"         orm:"id"           description:""`
	RoleName   string      `json:"roleName"   orm:"role_name"    description:""`
	RoleNameEn string      `json:"roleNameEn" orm:"role_name_en" description:""`
	CreateBy   int         `json:"createBy"   orm:"create_by"    description:""`
	CreateAt   *gtime.Time `json:"createAt"   orm:"create_at"    description:""`
	UpdateAt   *gtime.Time `json:"updateAt"   orm:"update_at"    description:""`
}
