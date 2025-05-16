package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/api/v1/common"
	"github.com/shichen437/stellardex/internal/app/user/model/entity"
)

type GetAllRolesReq struct {
	g.Meta `path:"/role/list" method:"get" tags:"角色管理" summary:"获取所有角色"`
	common.PageReq
}

type GetAllRolesRes struct {
	g.Meta `mime:"application/json"`
	Rows   []*entity.SysRole `json:"roles"`
}
