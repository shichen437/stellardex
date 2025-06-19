// ================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// You can delete these comments if you wish manually maintain this interface file.
// ================================================================================

package service

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/user"
)

type (
	IApiKey interface {
		List(ctx context.Context, req *v1.GetApiKeyListReq) (res *v1.GetApiKeyListRes, err error)
		Create(ctx context.Context, req *v1.PostApiKeyReq) (res *v1.PostApiKeyRes, err error)
		Disable(ctx context.Context, req *v1.DisableApiKeyReq) (res *v1.DisableApiKeyRes, err error)
		Delete(ctx context.Context, req *v1.DeleteApiKeyReq) (res *v1.DeleteApiKeyRes, err error)
	}
)

var (
	localApiKey IApiKey
)

func ApiKey() IApiKey {
	if localApiKey == nil {
		panic("implement not found for interface IApiKey, forgot register?")
	}
	return localApiKey
}

func RegisterApiKey(i IApiKey) {
	localApiKey = i
}
