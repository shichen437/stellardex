// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// BookmarkLabelDao is the data access object for the table bookmark_label.
type BookmarkLabelDao struct {
	table    string               // table is the underlying table name of the DAO.
	group    string               // group is the database configuration group name of the current DAO.
	columns  BookmarkLabelColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler   // handlers for customized model modification.
}

// BookmarkLabelColumns defines and stores column names for the table bookmark_label.
type BookmarkLabelColumns struct {
	Id       string //
	UserId   string //
	Name     string //
	CreateAt string //
	UpdateAt string //
}

// bookmarkLabelColumns holds the columns for the table bookmark_label.
var bookmarkLabelColumns = BookmarkLabelColumns{
	Id:       "id",
	UserId:   "user_id",
	Name:     "name",
	CreateAt: "create_at",
	UpdateAt: "update_at",
}

// NewBookmarkLabelDao creates and returns a new DAO object for table data access.
func NewBookmarkLabelDao(handlers ...gdb.ModelHandler) *BookmarkLabelDao {
	return &BookmarkLabelDao{
		group:    "default",
		table:    "bookmark_label",
		columns:  bookmarkLabelColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *BookmarkLabelDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *BookmarkLabelDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *BookmarkLabelDao) Columns() BookmarkLabelColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *BookmarkLabelDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *BookmarkLabelDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *BookmarkLabelDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
