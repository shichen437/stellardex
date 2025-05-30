// =================================================================================
// This file is auto-generated by the GoFrame CLI tool. You may modify it as needed.
// =================================================================================

package dao

import (
	"github.com/shichen437/stellardex/internal/app/settings/dao/internal"
)

// userImgDao is the data access object for the table user_img.
// You can define custom methods on it to extend its functionality as needed.
type userImgDao struct {
	*internal.UserImgDao
}

var (
	// UserImg is a globally accessible object for table user_img operations.
	UserImg = userImgDao{internal.NewUserImgDao()}
)

// Add your custom methods and functionality below.
