// ================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// You can delete these comments if you wish manually maintain this interface file.
// ================================================================================

package service

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/user"
)

type (
	ISysUser interface {
		GetUserInfo(ctx context.Context, req *v1.GetUserInfoReq) (res *v1.GetUserInfoRes, err error)
		List(ctx context.Context, req *v1.GetUserListReq) (res *v1.GetUserListRes, err error)
		Add(ctx context.Context, req *v1.PostUserReq) (res *v1.PostUserRes, err error)
		Update(ctx context.Context, req *v1.PutUserReq) (res *v1.PutUserRes, err error)
		Get(ctx context.Context, req *v1.GetUserByIdReq) (res *v1.GetUserByIdRes, err error)
		Delete(ctx context.Context, req *v1.DeleteUserReq) (res *v1.DeleteUserRes, err error)
		GetProfile(ctx context.Context, req *v1.GetProfileReq) (res *v1.GetProfileRes, err error)
		UpdateProfile(ctx context.Context, req *v1.PutProfileReq) (res *v1.PutProfileRes, err error)
		UpdatePwd(ctx context.Context, req *v1.PutPasswordReq) (res *v1.PutPasswordRes, err error)
		ResetPwd(ctx context.Context, req *v1.ResetPwdReq) (res *v1.ResetPwdRes, err error)
		UpdateAvatar(ctx context.Context, req *v1.PutAvatarReq) (res *v1.PutAvatarRes, err error)
	}
)

var (
	localSysUser ISysUser
)

func SysUser() ISysUser {
	if localSysUser == nil {
		panic("implement not found for interface ISysUser, forgot register?")
	}
	return localSysUser
}

func RegisterSysUser(i ISysUser) {
	localSysUser = i
}
