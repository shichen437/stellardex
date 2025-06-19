package ext

import "github.com/gogf/gf/v2/frame/g"

type GetConnectionReq struct {
	g.Meta `path:"/connect" method:"get" tags:"项目管理" summary:"获取项目列表"`
}
type GetConnectionRes struct {
	g.Meta `mime:"application/json"`
}
