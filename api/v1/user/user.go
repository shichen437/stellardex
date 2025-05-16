package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/api/v1/common"
	"github.com/shichen437/stellardex/internal/app/user/model"
)

type SignInReq struct {
	g.Meta   `path:"/signin" method:"post" tags:"用户管理" summary:"用户登录"`
	Username string `v:"required"`
	Password string `v:"required"`
}

type SignInRes struct {
	g.Meta `mime:"application/json"`
	Token  string `json:"token"`
}

type GetUserListReq struct {
	g.Meta `path:"/user/list" method:"get" tags:"用户管理" summary:"获取用户列表"`
	common.PageReq
}
type GetUserListRes struct {
	g.Meta `mime:"application/json"`
	Rows   []*model.UserInfo `p:"rows" json:"rows"`
	Total  int               `p:"total" json:"total"`
}

type PostUserReq struct {
	g.Meta   `path:"/user" method:"post" tags:"用户管理" summary:"创建用户"`
	Username string `v:"required" p:"username"`
	Nickname string `v:"required" p:"nickname"`
	RoleId   int    `v:"required" p:"roleId"`
}

type PostUserRes struct {
	g.Meta `mime:"application/json"`
}

type GetUserByIdReq struct {
	g.Meta `path:"/user/{id}" method:"get" tags:"用户管理" summary:"获取用户信息"`
	Id     uint `v:"required"`
}
type GetUserByIdRes struct {
	g.Meta `mime:"application/json"`
}

type PutUserReq struct {
	g.Meta   `path:"/user" method:"put" tags:"用户管理" summary:"更新用户信息"`
	Id       uint   `v:"required"`
	Username string `v:"required" p:"username"`
	Nickname string `v:"required" p:"nickname"`
	RoleId   int    `v:"required" p:"roleId"`
}
type PutUserRes struct {
	g.Meta `mime:"application/json"`
}

type DeleteUserReq struct {
	g.Meta `path:"/user/{id}" method:"delete" tags:"用户管理" summary:"删除用户"`
	Id     uint `v:"required"`
}
type DeleteUserRes struct {
	g.Meta `mime:"application/json"`
}

type GetUserInfoReq struct {
	g.Meta `path:"/user/getInfo" method:"get" tags:"用户管理" summary:"个人信息"`
}
type GetUserInfoRes struct {
	g.Meta `mime:"application/json"`
	*model.UserInfo
}

type ResetPwdReq struct {
	g.Meta `path:"/user/resetPwd" method:"put" tags:"用户管理" summary:"重置密码"`
	UserId int `v:"required" json:"userId"`
}
type ResetPwdRes struct {
	g.Meta `mime:"application/json"`
}

type PutUserStatusReq struct {
	g.Meta `path:"/user/changeStatus" method:"put" tags:"用户管理" summary:"修改用户状态"`
	Id     int `v:"required" json:"id"`
	Status int `v:"required" json:"status"`
}
type PutUserStatusRes struct {
	g.Meta `mime:"application/json"`
}
