// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// UserBookmarkDao is the data access object for the table user_bookmark.
type UserBookmarkDao struct {
	table    string              // table is the underlying table name of the DAO.
	group    string              // group is the database configuration group name of the current DAO.
	columns  UserBookmarkColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler  // handlers for customized model modification.
}

// UserBookmarkColumns defines and stores column names for the table user_bookmark.
type UserBookmarkColumns struct {
	Id            string //
	UserId        string //
	Author        string //
	ContentHtml   string //
	Excerpt       string //
	PublishedAt   string //
	ReadingTime   string //
	SourceUrl     string //
	Title         string //
	WordCount     string //
	ContentText   string //
	CoverImageUrl string //
	SiteName      string //
	Status        string //
	IsArchive     string //
	IsStarred     string //
	CreateAt      string //
	UpdateAt      string //
}

// userBookmarkColumns holds the columns for the table user_bookmark.
var userBookmarkColumns = UserBookmarkColumns{
	Id:            "id",
	UserId:        "user_id",
	Author:        "author",
	ContentHtml:   "content_html",
	Excerpt:       "excerpt",
	PublishedAt:   "published_at",
	ReadingTime:   "reading_time",
	SourceUrl:     "source_url",
	Title:         "title",
	WordCount:     "word_count",
	ContentText:   "content_text",
	CoverImageUrl: "cover_image_url",
	SiteName:      "site_name",
	Status:        "status",
	IsArchive:     "is_archive",
	IsStarred:     "is_starred",
	CreateAt:      "create_at",
	UpdateAt:      "update_at",
}

// NewUserBookmarkDao creates and returns a new DAO object for table data access.
func NewUserBookmarkDao(handlers ...gdb.ModelHandler) *UserBookmarkDao {
	return &UserBookmarkDao{
		group:    "default",
		table:    "user_bookmark",
		columns:  userBookmarkColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *UserBookmarkDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *UserBookmarkDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *UserBookmarkDao) Columns() UserBookmarkColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *UserBookmarkDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *UserBookmarkDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *UserBookmarkDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
