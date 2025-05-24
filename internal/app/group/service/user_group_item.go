// ================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// You can delete these comments if you wish manually maintain this interface file.
// ================================================================================

package service

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/group"
)

type (
	IUserGroupItem interface {
		List(ctx context.Context, req *v1.GetGroupItemListReq) (res *v1.GetGroupItemListRes, err error)
		Get(ctx context.Context, req *v1.GetGroupItemReq) (res *v1.GetGroupItemRes, err error)
		Add(ctx context.Context, req *v1.PostGroupItemReq) (res *v1.PostGroupItemRes, err error)
		Update(ctx context.Context, req *v1.PutGroupItemReq) (res *v1.PutGroupItemRes, err error)
		Delete(ctx context.Context, req *v1.DeleteGroupItemReq) (res *v1.DeleteGroupItemRes, err error)
		LocalIcon(ctx context.Context, req *v1.PostLocalIconReq) (res *v1.PostLocalIconRes, err error)
	}
)

var (
	localUserGroupItem IUserGroupItem
)

func UserGroupItem() IUserGroupItem {
	if localUserGroupItem == nil {
		panic("implement not found for interface IUserGroupItem, forgot register?")
	}
	return localUserGroupItem
}

func RegisterUserGroupItem(i IUserGroupItem) {
	localUserGroupItem = i
}
