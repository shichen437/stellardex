package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/shichen437/stellardex/api/v1/common"
	"github.com/shichen437/stellardex/internal/app/settings/model"
	"github.com/shichen437/stellardex/internal/app/settings/model/entity"
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

type GetDefaultLangReq struct {
	g.Meta `path:"/settings/lang" method:"get" tags:"用户设置" summary:"获取默认语言"`
}
type GetDefaultLangRes struct {
	g.Meta `mime:"application/json" example:"json"`
	Lang   string `json:"lang"`
}

type PostBgImageReq struct {
	g.Meta  `path:"/settings/bgImage" method:"post" tags:"用户设置" summary:"上传背景图片"`
	BgImage *ghttp.UploadFile `v:"required#file.emptyFile" json:"bgImage" type:"file"`
}
type PostBgImageRes struct {
	g.Meta   `mime:"application/json" example:"json"`
	ImageUrl string `json:"imageUrl"`
}

type GetBgImageListReq struct {
	g.Meta `path:"/settings/bgImage/list" method:"get" tags:"用户设置" summary:"获取背景图片列表"`
	common.PageReq
}
type GetBgImageListRes struct {
	g.Meta `mime:"application/json" example:"json"`
	Rows   []*entity.UserImg `p:"rows" json:"rows"`
	Total  int               `p:"total" json:"total"`
}

type DeleteBgImageReq struct {
	g.Meta `path:"/settings/bgImage/{id}" method:"delete" tags:"用户设置" summary:"删除背景图片"`
	Id     uint `v:"required#settings.valid.BgImgIdEmpty" json:"id"`
}
type DeleteBgImageRes struct {
	g.Meta `mime:"application/json" example:"json"`
}
