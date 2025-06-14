// =================================================================================
// This file is auto-generated by the GoFrame CLI tool. You may modify it as needed.
// =================================================================================

package dao

import (
	"github.com/shichen437/stellardex/internal/app/bookmark/dao/internal"
)

// bookmarkLabelDao is the data access object for the table bookmark_label.
// You can define custom methods on it to extend its functionality as needed.
type bookmarkLabelDao struct {
	*internal.BookmarkLabelDao
}

var (
	// BookmarkLabel is a globally accessible object for table bookmark_label operations.
	BookmarkLabel = bookmarkLabelDao{internal.NewBookmarkLabelDao()}
)

// Add your custom methods and functionality below.
