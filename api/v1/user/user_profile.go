package v1

import "github.com/gogf/gf/v2/frame/g"

type GetProfileReq struct {
	g.Meta `path:"/user/profile" method:"get" tags:"个人信息" summary:"获取个人信息"`
}
type GetProfileRes struct {
}

type PutProfileReq struct {
	g.Meta   `path:"/user/profile" method:"put" tags:"个人信息" summary:"修改个人信息"`
	Nickname string `v:"required" json:"nickname"`
	Email    string `v:"required" json:"email"`
	Mobile   string `v:"required" json:"mobile"`
	Sex      int    `v:"required" json:"sex"`
}
type PutProfileRes struct {
}

type PutPasswordReq struct {
	g.Meta `path:"/user/password" method:"put" tags:"个人信息" summary:"修改密码"`
	OldPwd string `v:"required" json:"oldPwd"`
	NewPwd string `v:"required" json:"newPwd"`
}
type PutPasswordRes struct {
}

type PutAvatarReq struct {
	g.Meta `path:"/user/avatar" method:"put" tags:"个人信息" summary:"修改头像"`
	Avatar string `v:"required" json:"avatar"`
}
type PutAvatarRes struct {
}
