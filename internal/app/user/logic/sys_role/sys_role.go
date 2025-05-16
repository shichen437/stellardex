package logic

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/util/gconv"
	v1 "github.com/shichen437/stellardex/api/v1/user"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/user/dao"
	"github.com/shichen437/stellardex/internal/app/user/model/entity"
	"github.com/shichen437/stellardex/internal/app/user/service"
)

type (
	sSysRole struct{}
)

func init() {
	service.RegisterSysRole(New())
}

func New() service.ISysRole {
	return &sSysRole{}
}

func (s *sSysRole) All(ctx context.Context, req *v1.GetAllRolesReq) (res *v1.GetAllRolesRes, err error) {
	res = &v1.GetAllRolesRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("Invalid user")
		return
	}
	role, err := s.GetUserRole(ctx, uid)
	if role == nil || err != nil || role.Id != commonConsts.SuperRoleId {
		err = gerror.New("Permission denied")
		return
	}
	dao.SysRole.Ctx(ctx).Scan(&res.Rows)
	return
}

func (s *sSysRole) GetUserRole(ctx context.Context, userId int) (role *entity.SysRole, err error) {
	if userId == 0 {
		return
	}
	var userRole *entity.SysUserRole
	sur, err := dao.SysUserRole.Ctx(ctx).Where(dao.SysUserRole.Columns().UserId, userId).One()
	gconv.Struct(sur, &userRole)
	if userRole == nil {
		return
	}
	sr, err := dao.SysRole.Ctx(ctx).Where(dao.SysRole.Columns().Id, userRole.RoleId).One()
	gconv.Struct(sr, &role)
	return
}
