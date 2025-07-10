// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// SysCurrencyDao is the data access object for the table sys_currency.
type SysCurrencyDao struct {
	table    string             // table is the underlying table name of the DAO.
	group    string             // group is the database configuration group name of the current DAO.
	columns  SysCurrencyColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler // handlers for customized model modification.
}

// SysCurrencyColumns defines and stores column names for the table sys_currency.
type SysCurrencyColumns struct {
	Id        string //
	Code      string //
	Symbol    string //
	IsDefault string //
	Rate      string //
	Sort      string //
	CreateAt  string //
	UpdateAt  string //
}

// sysCurrencyColumns holds the columns for the table sys_currency.
var sysCurrencyColumns = SysCurrencyColumns{
	Id:        "id",
	Code:      "code",
	Symbol:    "symbol",
	IsDefault: "is_default",
	Rate:      "rate",
	Sort:      "sort",
	CreateAt:  "create_at",
	UpdateAt:  "update_at",
}

// NewSysCurrencyDao creates and returns a new DAO object for table data access.
func NewSysCurrencyDao(handlers ...gdb.ModelHandler) *SysCurrencyDao {
	return &SysCurrencyDao{
		group:    "default",
		table:    "sys_currency",
		columns:  sysCurrencyColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *SysCurrencyDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *SysCurrencyDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *SysCurrencyDao) Columns() SysCurrencyColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *SysCurrencyDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *SysCurrencyDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *SysCurrencyDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
