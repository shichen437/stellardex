// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SysCurrency is the golang structure of table sys_currency for DAO operations like Where/Data.
type SysCurrency struct {
	g.Meta    `orm:"table:sys_currency, do:true"`
	Id        interface{} //
	Code      interface{} //
	Symbol    interface{} //
	IsDefault interface{} //
	Rate      interface{} //
	Sort      interface{} //
	CreateAt  *gtime.Time //
	UpdateAt  *gtime.Time //
}
