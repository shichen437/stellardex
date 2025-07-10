// ================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// You can delete these comments if you wish manually maintain this interface file.
// ================================================================================

package service

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/subscription"
)

type (
	IUserSubscription interface {
		List(ctx context.Context, req *v1.GetUserSubListReq) (res *v1.GetUserSubListRes, err error)
		Timeline(ctx context.Context, req *v1.GetSubTimelineReq) (res *v1.GetSubTimelineRes, err error)
		Overview(ctx context.Context, req *v1.GetSubOverviewReq) (res *v1.GetSubOverviewRes, err error)
		Post(ctx context.Context, req *v1.PostUserSubReq) (res *v1.PostUserSubRes, err error)
		Put(ctx context.Context, req *v1.PutUserSubReq) (res *v1.PutUserSubRes, err error)
		Delete(ctx context.Context, req *v1.DeleteUserSubReq) (res *v1.DeleteUserSubRes, err error)
		Enable(ctx context.Context, req *v1.PutEnableUserSubReq) (res *v1.PutEnableUserSubRes, err error)
		Disable(ctx context.Context, req *v1.PutDisableUserSubReq) (res *v1.PutDisableUserSubRes, err error)
	}
)

var (
	localUserSubscription IUserSubscription
)

func UserSubscription() IUserSubscription {
	if localUserSubscription == nil {
		panic("implement not found for interface IUserSubscription, forgot register?")
	}
	return localUserSubscription
}

func RegisterUserSubscription(i IUserSubscription) {
	localUserSubscription = i
}
