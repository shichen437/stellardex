// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// UserGroupItemDao is the data access object for the table user_group_item.
type UserGroupItemDao struct {
	table    string               // table is the underlying table name of the DAO.
	group    string               // group is the database configuration group name of the current DAO.
	columns  UserGroupItemColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler   // handlers for customized model modification.
}

// UserGroupItemColumns defines and stores column names for the table user_group_item.
type UserGroupItemColumns struct {
	Id          string //
	GroupId     string //
	Title       string //
	Url         string //
	LanUrl      string //
	Description string //
	IconType    string //
	IconUrl     string //
	BgColor     string //
	Opacity     string //
	OrderNum    string //
	CreateAt    string //
	UpdateAt    string //
}

// userGroupItemColumns holds the columns for the table user_group_item.
var userGroupItemColumns = UserGroupItemColumns{
	Id:          "id",
	GroupId:     "group_id",
	Title:       "title",
	Url:         "url",
	LanUrl:      "lan_url",
	Description: "description",
	IconType:    "icon_type",
	IconUrl:     "icon_url",
	BgColor:     "bg_color",
	Opacity:     "opacity",
	OrderNum:    "order_num",
	CreateAt:    "create_at",
	UpdateAt:    "update_at",
}

// NewUserGroupItemDao creates and returns a new DAO object for table data access.
func NewUserGroupItemDao(handlers ...gdb.ModelHandler) *UserGroupItemDao {
	return &UserGroupItemDao{
		group:    "default",
		table:    "user_group_item",
		columns:  userGroupItemColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *UserGroupItemDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *UserGroupItemDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *UserGroupItemDao) Columns() UserGroupItemColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *UserGroupItemDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *UserGroupItemDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *UserGroupItemDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
