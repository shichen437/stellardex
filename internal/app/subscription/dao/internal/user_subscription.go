// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// UserSubscriptionDao is the data access object for the table user_subscription.
type UserSubscriptionDao struct {
	table    string                  // table is the underlying table name of the DAO.
	group    string                  // group is the database configuration group name of the current DAO.
	columns  UserSubscriptionColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler      // handlers for customized model modification.
}

// UserSubscriptionColumns defines and stores column names for the table user_subscription.
type UserSubscriptionColumns struct {
	Id        string //
	UserId    string //
	Title     string //
	Amount    string //
	CycleNum  string //
	CycleType string //
	CycleDay  string //
	StartDate string //
	NextDate  string //
	Currency  string //
	Category  string //
	Site      string //
	Status    string //
	CreateAt  string //
	UpdateAt  string //
}

// userSubscriptionColumns holds the columns for the table user_subscription.
var userSubscriptionColumns = UserSubscriptionColumns{
	Id:        "id",
	UserId:    "user_id",
	Title:     "title",
	Amount:    "amount",
	CycleNum:  "cycle_num",
	CycleType: "cycle_type",
	CycleDay:  "cycle_day",
	StartDate: "start_date",
	NextDate:  "next_date",
	Currency:  "currency",
	Category:  "category",
	Site:      "site",
	Status:    "status",
	CreateAt:  "create_at",
	UpdateAt:  "update_at",
}

// NewUserSubscriptionDao creates and returns a new DAO object for table data access.
func NewUserSubscriptionDao(handlers ...gdb.ModelHandler) *UserSubscriptionDao {
	return &UserSubscriptionDao{
		group:    "default",
		table:    "user_subscription",
		columns:  userSubscriptionColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *UserSubscriptionDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *UserSubscriptionDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *UserSubscriptionDao) Columns() UserSubscriptionColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *UserSubscriptionDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *UserSubscriptionDao) Ctx(ctx context.Context) *gdb.Model {
	model := dao.DB().Model(dao.table)
	for _, handler := range dao.handlers {
		model = handler(model)
	}
	return model.Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *UserSubscriptionDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
