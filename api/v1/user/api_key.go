package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/api/v1/common"
	"github.com/shichen437/stellardex/internal/app/user/model/entity"
)

type GetApiKeyListReq struct {
	g.Meta `path:"/user/apiKey/list" tags:"ApiKey管理" method:"get" summary:"获取ApiKey列表"`
	common.PageReq
	Status int `json:"status" dc:"ApiKey状态"`
}
type GetApiKeyListRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Rows   []*entity.SysApiKey `json:"rows" dc:"ApiKey列表"`
	Total  int                 `json:"total" dc:"ApiKey总数"`
}

type PostApiKeyReq struct {
	g.Meta     `path:"/user/apiKey" tags:"ApiKey管理" method:"post" summary:"新增ApiKey"`
	ApiKeyName string `json:"apiKeyName" v:"required|length:1,12#user.apiKey.valid.ApiKeyNameEmpty|user.apiKey.valid.ApiKeyNameLength" dc:"ApiKey名称"`
	ExpiresAt  string `json:"expiresAt" dc:"ApiKey过期时间"`
}
type PostApiKeyRes struct {
	g.Meta `mime:"application/json" example:"string"`
	ApiKey string `json:"apiKey" dc:"ApiKey"`
}

type DeleteApiKeyReq struct {
	g.Meta `path:"/user/apiKey/{id}" tags:"ApiKey管理" method:"delete" summary:"删除ApiKey"`
	Id     int64 `json:"id" v:"required#user.apiKey.valid.IdEmpty" dc:"ApiKey ID"`
}
type DeleteApiKeyRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type DisableApiKeyReq struct {
	g.Meta `path:"/user/apiKey/disable/{id}" tags:"ApiKey管理" method:"put" summary:"禁用ApiKey"`
	Id     int64 `json:"id" v:"required#user.apiKey.valid.IdEmpty" dc:"ApiKey ID"`
}
type DisableApiKeyRes struct {
	g.Meta `mime:"application/json" example:"string"`
}
