// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SysCurrency is the golang structure for table sys_currency.
type SysCurrency struct {
	Id        int         `json:"id"        orm:"id"         description:""`
	Code      string      `json:"code"      orm:"code"       description:""`
	Symbol    string      `json:"symbol"    orm:"symbol"     description:""`
	IsDefault int         `json:"isDefault" orm:"is_default" description:""`
	Rate      float32     `json:"rate"      orm:"rate"       description:""`
	Sort      int         `json:"sort"      orm:"sort"       description:""`
	CreateAt  *gtime.Time `json:"createAt"  orm:"create_at"  description:""`
	UpdateAt  *gtime.Time `json:"updateAt"  orm:"update_at"  description:""`
}
