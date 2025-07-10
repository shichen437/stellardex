// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// UserSubscription is the golang structure for table user_subscription.
type UserSubscription struct {
	Id        int         `json:"id"        orm:"id"         description:""`
	UserId    int         `json:"userId"    orm:"user_id"    description:""`
	Title     string      `json:"title"     orm:"title"      description:""`
	Amount    float32     `json:"amount"    orm:"amount"     description:""`
	CycleNum  int         `json:"cycleNum"  orm:"cycle_num"  description:""`
	CycleType int         `json:"cycleType" orm:"cycle_type" description:""`
	CycleDay  int         `json:"cycleDay"  orm:"cycle_day"  description:""`
	StartDate *gtime.Time `json:"startDate" orm:"start_date" description:""`
	NextDate  *gtime.Time `json:"nextDate"  orm:"next_date"  description:""`
	Currency  int         `json:"currency"  orm:"currency"   description:""`
	Category  string      `json:"category"  orm:"category"   description:""`
	Site      string      `json:"site"      orm:"site"       description:""`
	Status    int         `json:"status"    orm:"status"     description:""`
	CreateAt  *gtime.Time `json:"createAt"  orm:"create_at"  description:""`
	UpdateAt  *gtime.Time `json:"updateAt"  orm:"update_at"  description:""`
}
