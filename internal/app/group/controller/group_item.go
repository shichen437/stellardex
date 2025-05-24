package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/group"
	"github.com/shichen437/stellardex/internal/app/group/service"
)

type sysGroupItemController struct {
}

var UserGroupItem = sysGroupItemController{}

func (s *sysGroupItemController) List(ctx context.Context, req *v1.GetGroupItemListReq) (res *v1.GetGroupItemListRes, err error) {
	return service.UserGroupItem().List(ctx, req)
}

func (c *sysGroupItemController) Get(ctx context.Context, req *v1.GetGroupItemReq) (res *v1.GetGroupItemRes, err error) {
	return service.UserGroupItem().Get(ctx, req)

}

func (c *sysGroupItemController) Add(ctx context.Context, req *v1.PostGroupItemReq) (res *v1.PostGroupItemRes, err error) {
	return service.UserGroupItem().Add(ctx, req)
}

func (c *sysGroupItemController) Update(ctx context.Context, req *v1.PutGroupItemReq) (res *v1.PutGroupItemRes, err error) {
	return service.UserGroupItem().Update(ctx, req)
}

func (c *sysGroupItemController) Delete(ctx context.Context, req *v1.DeleteGroupItemReq) (res *v1.DeleteGroupItemRes, err error) {
	return service.UserGroupItem().Delete(ctx, req)
}

func (c *sysGroupItemController) LocalIcon(ctx context.Context, req *v1.PostLocalIconReq) (res *v1.PostLocalIconRes, err error) {
	return service.UserGroupItem().LocalIcon(ctx, req)
}
