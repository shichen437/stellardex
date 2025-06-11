// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// UserCustomSelectorDao is the data access object for the table user_custom_selector.
type UserCustomSelectorDao struct {
	table    string                    // table is the underlying table name of the DAO.
	group    string                    // group is the database configuration group name of the current DAO.
	columns  UserCustomSelectorColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler        // handlers for customized model modification.
}

// UserCustomSelectorColumns defines and stores column names for the table user_custom_selector.
type UserCustomSelectorColumns struct {
	Id            string //
	UserId        string //
	Domain        string //
	Title         string //
	Byline        string //
	Excerpt       string //
	Content       string //
	PublishedTime string //
	Cookie        string //
	CreateAt      string //
	UpdateAt      string //
}

// userCustomSelectorColumns holds the columns for the table user_custom_selector.
var userCustomSelectorColumns = UserCustomSelectorColumns{
	Id:            "id",
	UserId:        "user_id",
	Domain:        "domain",
	Title:         "title",
	Byline:        "byline",
	Excerpt:       "excerpt",
	Content:       "content",
	PublishedTime: "published_time",
	Cookie:        "cookie",
	CreateAt:      "create_at",
	UpdateAt:      "update_at",
}

// NewUserCustomSelectorDao creates and returns a new DAO object for table data access.
func NewUserCustomSelectorDao(handlers ...gdb.ModelHandler) *UserCustomSelectorDao {
	return &UserCustomSelectorDao{
		group:    "default",
		table:    "user_custom_selector",
		columns:  userCustomSelectorColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *UserCustomSelectorDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *UserCustomSelectorDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *UserCustomSelectorDao) Columns() UserCustomSelectorColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *UserCustomSelectorDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *UserCustomSelectorDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *UserCustomSelectorDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
