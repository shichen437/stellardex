package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

type GetProfileReq struct {
	g.Meta `path:"/user/profile" method:"get" tags:"个人信息" summary:"获取个人信息"`
}
type GetProfileRes struct {
}

type PutProfileReq struct {
	g.Meta   `path:"/user/profile" method:"put" tags:"个人信息" summary:"修改个人信息"`
	Nickname string `v:"required|length:1,10#user.valid.NickNameEmpty|user.valid.NickNameLength" json:"nickname"`
	Email    string `v:"required|email#user.valid.EmailEmpty|user.valid.EmailFormat" json:"email"`
	Mobile   string `v:"required#user.valid.PhoneEmpty" json:"mobile"`
	Sex      int    `v:"required#user.valid.SexEmpty" json:"sex"`
}
type PutProfileRes struct {
}

type PutPasswordReq struct {
	g.Meta `path:"/user/password" method:"put" tags:"个人信息" summary:"修改密码"`
	OldPwd string `v:"required|length:6,20#user.valid.PasswordEmpty|user.valid.PasswordLength" json:"oldPwd"`
	NewPwd string `v:"required|length:6,20|not-eq:OldPwd#user.valid.PasswordNewEmpty|user.valid.PasswordLength|user.valid.PasswordSame" json:"newPwd"`
}
type PutPasswordRes struct {
}

type PutAvatarReq struct {
	g.Meta `path:"/user/avatar" method:"put" tags:"个人信息" summary:"修改头像"`
	Avatar *ghttp.UploadFile `v:"required#user.valid.FileEmpty" json:"avatar" type:"file"`
}
type PutAvatarRes struct {
	g.Meta `mime:"application/json"`
	ImgUrl string `json:"imgUrl"`
}
