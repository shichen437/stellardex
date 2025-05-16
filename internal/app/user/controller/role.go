package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/user"
	"github.com/shichen437/stellardex/internal/app/user/service"
)

type sysRoleController struct {
}

var SysRole = sysRoleController{}

func (s *sysRoleController) All(ctx context.Context, req *v1.GetAllRolesReq) (res *v1.GetAllRolesRes, err error) {
	return service.SysRole().All(ctx, req)
}
