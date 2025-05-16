// ================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// You can delete these comments if you wish manually maintain this interface file.
// ================================================================================

package service

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/user"
	"github.com/shichen437/stellardex/internal/app/user/model/entity"
)

type (
	ISysRole interface {
		All(ctx context.Context, req *v1.GetAllRolesReq) (res *v1.GetAllRolesRes, err error)
		GetUserRole(ctx context.Context, userId int) (role *entity.SysRole, err error)
	}
)

var (
	localSysRole ISysRole
)

func SysRole() ISysRole {
	if localSysRole == nil {
		panic("implement not found for interface ISysRole, forgot register?")
	}
	return localSysRole
}

func RegisterSysRole(i ISysRole) {
	localSysRole = i
}
