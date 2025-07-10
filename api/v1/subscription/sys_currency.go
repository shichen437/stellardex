package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/api/v1/common"
	"github.com/shichen437/stellardex/internal/app/subscription/model/entity"
)

type GetCurrencyListReq struct {
	g.Meta `path:"/currency/list" method:"get" tags:"币种管理" summary:"获取币种列表"`
	common.PageReq
	Code string `json:"code"`
}
type GetCurrencyListRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Total  int                   `json:"total"`
	Rows   []*entity.SysCurrency `json:"rows"`
}

type PostCurrencyReq struct {
	g.Meta `path:"/currency" method:"post" tags:"币种管理" summary:"创建币种"`
	Code   string  `json:"code" v:"length:1,5#sub.currency.valid.codeLength"`
	Symbol string  `json:"symbol" v:"length:1,5#sub.currency.valid.symbolLength"`
	Rate   float64 `json:"rate" v:"min:0#sub.currency.valid.rate"`
	Sort   int     `json:"sort" v:"min:0|max:99#sub.currency.valid.sort|sub.currency.valid.sort"`
}
type PostCurrencyRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type PutCurrencyReq struct {
	g.Meta `path:"/currency" method:"put" tags:"币种管理" summary:"更新币种"`
	Id     int     `json:"id" v:"required#sub.currency.valid.IdEmpty"`
	Code   string  `json:"code" v:"length:1,5#sub.currency.valid.codeLength"`
	Symbol string  `json:"symbol" v:"length:1,5#sub.currency.valid.symbolLength"`
	Rate   float64 `json:"rate" v:"min:0#sub.currency.valid.rate"`
	Sort   int     `json:"sort" v:"min:0|max:99#sub.currency.valid.sort|sub.currency.valid.sort"`
}
type PutCurrencyRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type DeleteCurrencyReq struct {
	g.Meta `path:"/currency/{id}" method:"delete" tags:"币种管理" summary:"删除币种"`
	Id     int `json:"id" v:"required#sub.currency.valid.IdEmpty"`
}
type DeleteCurrencyRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type PutCurrencyDefaultReq struct {
	g.Meta `path:"/currency/default/{id}" method:"put" tags:"币种管理" summary:"设置默认币种"`
	Id     int `json:"id" v:"required#sub.currency.valid.IdEmpty"`
}
type PutCurrencyDefaultRes struct {
	g.Meta `mime:"application/json" example:"string"`
}

type GetCurrencyDefaultReq struct {
	g.Meta `path:"/currency/default" method:"get" tags:"币种管理" summary:"获取默认币种"`
}
type GetCurrencyDefaultRes struct {
	g.Meta `mime:"application/json" example:"string"`
	Data   *entity.SysCurrency `json:"data"`
}
