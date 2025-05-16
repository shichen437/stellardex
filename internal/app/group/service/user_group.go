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
	IUserGroup interface {
		List(ctx context.Context, req *v1.GetGroupListReq) (res *v1.GetGroupListRes, err error)
		Get(ctx context.Context, req *v1.GetGroupReq) (res *v1.GetGroupRes, err error)
		Add(ctx context.Context, req *v1.PostGroupReq) (res *v1.PostGroupRes, err error)
		Update(ctx context.Context, req *v1.PutGroupReq) (res *v1.PutGroupRes, err error)
		Delete(ctx context.Context, req *v1.DeleteGroupReq) (res *v1.DeleteGroupRes, err error)
		UpdateVisible(ctx context.Context, req *v1.PutGroupVisibleReq) (res *v1.PutGroupVisibleRes, err error)
		UpdateOrder(ctx context.Context, req *v1.PutGroupOrderReq) (res *v1.PutGroupOrderRes, err error)
	}
)

var (
	localUserGroup IUserGroup
)

func UserGroup() IUserGroup {
	if localUserGroup == nil {
		panic("implement not found for interface IUserGroup, forgot register?")
	}
	return localUserGroup
}

func RegisterUserGroup(i IUserGroup) {
	localUserGroup = i
}
