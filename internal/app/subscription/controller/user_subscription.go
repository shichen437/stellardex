package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/subscription"
	"github.com/shichen437/stellardex/internal/app/subscription/service"
)

type userSubController struct {
}

var UserSub = userSubController{}

func (c *userSubController) List(ctx context.Context, req *v1.GetUserSubListReq) (res *v1.GetUserSubListRes, err error) {
	return service.UserSubscription().List(ctx, req)
}

func (c *userSubController) Timeline(ctx context.Context, req *v1.GetSubTimelineReq) (res *v1.GetSubTimelineRes, err error) {
	return service.UserSubscription().Timeline(ctx, req)
}

func (c *userSubController) Overview(ctx context.Context, req *v1.GetSubOverviewReq) (res *v1.GetSubOverviewRes, err error) {
	return service.UserSubscription().Overview(ctx, req)
}

func (c *userSubController) Post(ctx context.Context, req *v1.PostUserSubReq) (res *v1.PostUserSubRes, err error) {
	return service.UserSubscription().Post(ctx, req)
}

func (c *userSubController) Put(ctx context.Context, req *v1.PutUserSubReq) (res *v1.PutUserSubRes, err error) {
	return service.UserSubscription().Put(ctx, req)
}

func (c *userSubController) Delete(ctx context.Context, req *v1.DeleteUserSubReq) (res *v1.DeleteUserSubRes, err error) {
	return service.UserSubscription().Delete(ctx, req)
}

func (c *userSubController) Enable(ctx context.Context, req *v1.PutEnableUserSubReq) (res *v1.PutEnableUserSubRes, err error) {
	return service.UserSubscription().Enable(ctx, req)
}

func (c *userSubController) Disable(ctx context.Context, req *v1.PutDisableUserSubReq) (res *v1.PutDisableUserSubRes, err error) {
	return service.UserSubscription().Disable(ctx, req)
}
