package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/internal/app/settings/model"
)

type PutSettingsReq struct {
	g.Meta `path:"/settings" method:"put" tags:"用户设置" summary:"修改用户设置"`
	*model.UserSettings
}
type PutSettingsRes struct {
}

type GetSettingsReq struct {
	g.Meta `path:"/settings" method:"get" tags:"用户设置" summary:"获取用户设置"`
}
type GetSettingsRes struct {
	g.Meta `mime:"application/json" example:"json"`
	*model.UserSettings
}
