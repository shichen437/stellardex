// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// SysApiKeyDao is the data access object for the table sys_api_key.
type SysApiKeyDao struct {
	table    string             // table is the underlying table name of the DAO.
	group    string             // group is the database configuration group name of the current DAO.
	columns  SysApiKeyColumns   // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler // handlers for customized model modification.
}

// SysApiKeyColumns defines and stores column names for the table sys_api_key.
type SysApiKeyColumns struct {
	Id         string //
	UserId     string //
	ApiKey     string //
	ApiKeyName string //
	Status     string //
	ExpiresAt  string //
	CreateAt   string //
	UpdateAt   string //
}

// sysApiKeyColumns holds the columns for the table sys_api_key.
var sysApiKeyColumns = SysApiKeyColumns{
	Id:         "id",
	UserId:     "user_id",
	ApiKey:     "api_key",
	ApiKeyName: "api_key_name",
	Status:     "status",
	ExpiresAt:  "expires_at",
	CreateAt:   "create_at",
	UpdateAt:   "update_at",
}

// NewSysApiKeyDao creates and returns a new DAO object for table data access.
func NewSysApiKeyDao(handlers ...gdb.ModelHandler) *SysApiKeyDao {
	return &SysApiKeyDao{
		group:    "default",
		table:    "sys_api_key",
		columns:  sysApiKeyColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *SysApiKeyDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *SysApiKeyDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *SysApiKeyDao) Columns() SysApiKeyColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *SysApiKeyDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *SysApiKeyDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *SysApiKeyDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
