package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/settings"
	"github.com/shichen437/stellardex/internal/app/settings/service"
)

type userSettingsController struct {
}

var UserSettings = userSettingsController{}

func (c *userSettingsController) Get(ctx context.Context, req *v1.GetSettingsReq) (res *v1.GetSettingsRes, err error) {
	return service.UserSettings().Get(ctx, req)
}

func (c *userSettingsController) Update(ctx context.Context, req *v1.PutSettingsReq) (res *v1.PutSettingsRes, err error) {
	return service.UserSettings().Update(ctx, req)
}

func (c *userSettingsController) GetDefaultLang(ctx context.Context, req *v1.GetDefaultLangReq) (res *v1.GetDefaultLangRes, err error) {
	return service.UserSettings().GetDefaultLang(ctx, req)
}
