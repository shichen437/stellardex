// ================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// You can delete these comments if you wish manually maintain this interface file.
// ================================================================================

package service

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/settings"
)

type (
	IUserSettings interface {
		Get(ctx context.Context, req *v1.GetSettingsReq) (res *v1.GetSettingsRes, err error)
		Update(ctx context.Context, req *v1.PutSettingsReq) (res *v1.PutSettingsRes, err error)
		GetDefaultLang(ctx context.Context, req *v1.GetDefaultLangReq) (res *v1.GetDefaultLangRes, err error)
		BgImage(ctx context.Context, req *v1.PostBgImageReq) (res *v1.PostBgImageRes, err error)
		BgImageList(ctx context.Context, req *v1.GetBgImageListReq) (res *v1.GetBgImageListRes, err error)
		BgImageDelete(ctx context.Context, req *v1.DeleteBgImageReq) (res *v1.DeleteBgImageRes, err error)
		CheckVersion(ctx context.Context, req *v1.CheckVersionReq) (res *v1.CheckVersionRes, err error)
		Monitor(ctx context.Context, req *v1.GetMonitorInfoReq) (res *v1.GetMonitorInfoRes, err error)
	}
)

var (
	localUserSettings IUserSettings
)

func UserSettings() IUserSettings {
	if localUserSettings == nil {
		panic("implement not found for interface IUserSettings, forgot register?")
	}
	return localUserSettings
}

func RegisterUserSettings(i IUserSettings) {
	localUserSettings = i
}
