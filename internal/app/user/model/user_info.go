package model

import "github.com/gogf/gf/v2/os/gtime"

type UserInfo struct {
	Id       int         `json:"id"`
	Username string      `json:"username"`
	Nickname string      `json:"nickname"`
	Sex      int         `json:"sex"`
	Email    string      `json:"email"`
	Mobile   string      `json:"mobile"`
	Status   int         `json:"status"`
	Avatar   string      `json:"avatar"`
	CreateAt *gtime.Time `json:"createAt"`
	UpdateAt *gtime.Time `json:"updateAt"`
	IsAdmin  bool        `json:"isAdmin"`
	RoleId   int         `json:"roleId"`
	RoleName string      `json:"roleName"`
}
