package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/group"
	"github.com/shichen437/stellardex/internal/app/group/service"
)

type sysGroupController struct {
}

var UserGroup = sysGroupController{}

func (c *sysGroupController) List(ctx context.Context, req *v1.GetGroupListReq) (res *v1.GetGroupListRes, err error) {
	return service.UserGroup().List(ctx, req)
}

func (c *sysGroupController) Get(ctx context.Context, req *v1.GetGroupReq) (res *v1.GetGroupRes, err error) {
	return service.UserGroup().Get(ctx, req)

}

func (c *sysGroupController) Add(ctx context.Context, req *v1.PostGroupReq) (res *v1.PostGroupRes, err error) {
	return service.UserGroup().Add(ctx, req)
}

func (c *sysGroupController) Update(ctx context.Context, req *v1.PutGroupReq) (res *v1.PutGroupRes, err error) {
	return service.UserGroup().Update(ctx, req)
}

func (c *sysGroupController) Delete(ctx context.Context, req *v1.DeleteGroupReq) (res *v1.DeleteGroupRes, err error) {
	return service.UserGroup().Delete(ctx, req)
}

func (c *sysGroupController) UpdateVisible(ctx context.Context, req *v1.PutGroupVisibleReq) (res *v1.PutGroupVisibleRes, err error) {
	return service.UserGroup().UpdateVisible(ctx, req)
}

func (c *sysGroupController) UpdateOrderNum(ctx context.Context, req *v1.PutGroupOrderReq) (res *v1.PutGroupOrderRes, err error) {
	return service.UserGroup().UpdateOrder(ctx, req)
}
