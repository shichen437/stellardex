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
	ISysCurrency interface {
		List(ctx context.Context, req *v1.GetCurrencyListReq) (res *v1.GetCurrencyListRes, err error)
		Post(ctx context.Context, req *v1.PostCurrencyReq) (res *v1.PostCurrencyRes, err error)
		Put(ctx context.Context, req *v1.PutCurrencyReq) (res *v1.PutCurrencyRes, err error)
		Delete(ctx context.Context, req *v1.DeleteCurrencyReq) (res *v1.DeleteCurrencyRes, err error)
		Default(ctx context.Context, req *v1.PutCurrencyDefaultReq) (res *v1.PutCurrencyDefaultRes, err error)
		GetDefault(ctx context.Context, req *v1.GetCurrencyDefaultReq) (res *v1.GetCurrencyDefaultRes, err error)
	}
)

var (
	localSysCurrency ISysCurrency
)

func SysCurrency() ISysCurrency {
	if localSysCurrency == nil {
		panic("implement not found for interface ISysCurrency, forgot register?")
	}
	return localSysCurrency
}

func RegisterSysCurrency(i ISysCurrency) {
	localSysCurrency = i
}
