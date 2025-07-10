// ================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// You can delete these comments if you wish manually maintain this interface file.
// ================================================================================

package service

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/notification"
)

type (
	ISysNotify interface {
		List(ctx context.Context, req *v1.GetNotificationListReq) (res *v1.GetNotificationListRes, err error)
		Unread(ctx context.Context, req *v1.GetUnreadNotificationReq) (res *v1.GetUnreadNotificationRes, err error)
		ReadAll(ctx context.Context, req *v1.PutAllNotificationReadReq) (res *v1.PutAllNotificationReadRes, err error)
		Delete(ctx context.Context, req *v1.DeleteNotificationReq) (res *v1.DeleteNotificationRes, err error)
		DeleteAll(ctx context.Context, req *v1.DeleteAllNotificationReq) (res *v1.DeleteAllNotificationRes, err error)
	}
)

var (
	localSysNotify ISysNotify
)

func SysNotify() ISysNotify {
	if localSysNotify == nil {
		panic("implement not found for interface ISysNotify, forgot register?")
	}
	return localSysNotify
}

func RegisterSysNotify(i ISysNotify) {
	localSysNotify = i
}
