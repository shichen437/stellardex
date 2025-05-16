package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/user"
	"github.com/shichen437/stellardex/internal/app/user/service"
)

type sysUserController struct {
}

var SysUser = sysUserController{}

func (s *sysUserController) GetUserInfo(ctx context.Context, req *v1.GetUserInfoReq) (res *v1.GetUserInfoRes, err error) {
	return service.SysUser().GetUserInfo(ctx, req)
}

func (s *sysUserController) List(ctx context.Context, req *v1.GetUserListReq) (res *v1.GetUserListRes, err error) {
	return service.SysUser().List(ctx, req)
}

func (s *sysUserController) Add(ctx context.Context, req *v1.PostUserReq) (res *v1.PostUserRes, err error) {
	return service.SysUser().Add(ctx, req)
}

func (s *sysUserController) Update(ctx context.Context, req *v1.PutUserReq) (res *v1.PutUserRes, err error) {
	return service.SysUser().Update(ctx, req)
}

func (s *sysUserController) Delete(ctx context.Context, req *v1.DeleteUserReq) (res *v1.DeleteUserRes, err error) {
	return service.SysUser().Delete(ctx, req)
}

func (s *sysUserController) Get(ctx context.Context, req *v1.GetUserByIdReq) (res *v1.GetUserByIdRes, err error) {
	return service.SysUser().Get(ctx, req)
}

func (s *sysUserController) Profile(ctx context.Context, req *v1.GetProfileReq) (res *v1.GetProfileRes, err error) {
	return service.SysUser().GetProfile(ctx, req)
}

func (s *sysUserController) UpdateProfile(ctx context.Context, req *v1.PutProfileReq) (res *v1.PutProfileRes, err error) {
	return service.SysUser().UpdateProfile(ctx, req)
}

func (s *sysUserController) UpdatePwd(ctx context.Context, req *v1.PutPasswordReq) (res *v1.PutPasswordRes, err error) {
	return service.SysUser().UpdatePwd(ctx, req)
}

func (s *sysUserController) UpdateAvatar(ctx context.Context, req *v1.PutAvatarReq) (res *v1.PutAvatarRes, err error) {
	return service.SysUser().UpdateAvatar(ctx, req)
}

func (s *sysUserController) ResetPwd(ctx context.Context, req *v1.ResetPwdReq) (res *v1.ResetPwdRes, err error) {
	return service.SysUser().ResetPwd(ctx, req)
}
