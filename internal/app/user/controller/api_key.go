package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/user"
	"github.com/shichen437/stellardex/internal/app/user/service"
)

type apiKeyController struct {
}

var ApiKey = apiKeyController{}

func (a *apiKeyController) List(ctx context.Context, req *v1.GetApiKeyListReq) (res *v1.GetApiKeyListRes, err error) {
	return service.ApiKey().List(ctx, req)
}

func (a *apiKeyController) Create(ctx context.Context, req *v1.PostApiKeyReq) (res *v1.PostApiKeyRes, err error) {
	return service.ApiKey().Create(ctx, req)
}

func (a *apiKeyController) Disable(ctx context.Context, req *v1.DisableApiKeyReq) (res *v1.DisableApiKeyRes, err error) {
	return service.ApiKey().Disable(ctx, req)
}

func (a *apiKeyController) Delete(ctx context.Context, req *v1.DeleteApiKeyReq) (res *v1.DeleteApiKeyRes, err error) {
	return service.ApiKey().Delete(ctx, req)
}
