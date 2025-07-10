package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/subscription"
	"github.com/shichen437/stellardex/internal/app/subscription/service"
)

type sysCurrencyController struct {
}

var SysCurrency = sysCurrencyController{}

func (c *sysCurrencyController) List(ctx context.Context, req *v1.GetCurrencyListReq) (res *v1.GetCurrencyListRes, err error) {
	return service.SysCurrency().List(ctx, req)
}

func (c *sysCurrencyController) Post(ctx context.Context, req *v1.PostCurrencyReq) (res *v1.PostCurrencyRes, err error) {
	return service.SysCurrency().Post(ctx, req)
}

func (c *sysCurrencyController) Put(ctx context.Context, req *v1.PutCurrencyReq) (res *v1.PutCurrencyRes, err error) {
	return service.SysCurrency().Put(ctx, req)
}

func (c *sysCurrencyController) Delete(ctx context.Context, req *v1.DeleteCurrencyReq) (res *v1.DeleteCurrencyRes, err error) {
	return service.SysCurrency().Delete(ctx, req)
}

func (c *sysCurrencyController) PutDefault(ctx context.Context, req *v1.PutCurrencyDefaultReq) (res *v1.PutCurrencyDefaultRes, err error) {
	return service.SysCurrency().Default(ctx, req)
}

func (c *sysCurrencyController) GetDefault(ctx context.Context, req *v1.GetCurrencyDefaultReq) (res *v1.GetCurrencyDefaultRes, err error) {
	return service.SysCurrency().GetDefault(ctx, req)
}
