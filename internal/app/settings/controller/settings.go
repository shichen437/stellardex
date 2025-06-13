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

func (c *userSettingsController) BgImageList(ctx context.Context, req *v1.GetBgImageListReq) (res *v1.GetBgImageListRes, err error) {
	return service.UserSettings().BgImageList(ctx, req)
}

func (c *userSettingsController) BgImage(ctx context.Context, req *v1.PostBgImageReq) (res *v1.PostBgImageRes, err error) {
	return service.UserSettings().BgImage(ctx, req)
}

func (c *userSettingsController) BgImageDelete(ctx context.Context, req *v1.DeleteBgImageReq) (res *v1.DeleteBgImageRes, err error) {
	return service.UserSettings().BgImageDelete(ctx, req)
}

func (c *userSettingsController) CheckVersion(ctx context.Context, req *v1.CheckVersionReq) (res *v1.CheckVersionRes, err error) {
	return service.UserSettings().CheckVersion(ctx, req)
}

func (c *userSettingsController) Monitor(ctx context.Context, req *v1.GetMonitorInfoReq) (res *v1.GetMonitorInfoRes, err error) {
	return service.UserSettings().Monitor(ctx, req)
}
