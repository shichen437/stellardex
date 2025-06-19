// ================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// You can delete these comments if you wish manually maintain this interface file.
// ================================================================================

package service

import (
	"github.com/gogf/gf/v2/net/ghttp"
)

type (
	IApiKeyMiddleware interface {
		ApiKeyMiddleware(r *ghttp.Request)
	}
)

var (
	localApiKeyMiddleware IApiKeyMiddleware
)

func ApiKeyMiddleware() IApiKeyMiddleware {
	if localApiKeyMiddleware == nil {
		panic("implement not found for interface IApiKeyMiddleware, forgot register?")
	}
	return localApiKeyMiddleware
}

func RegisterApiKeyMiddleware(i IApiKeyMiddleware) {
	localApiKeyMiddleware = i
}
