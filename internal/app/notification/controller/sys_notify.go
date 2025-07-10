package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/notification"
	"github.com/shichen437/stellardex/internal/app/notification/service"
)

type sysNotifyController struct {
}

var SysNotify = sysNotifyController{}

func (s *sysNotifyController) List(ctx context.Context, req *v1.GetNotificationListReq) (res *v1.GetNotificationListRes, err error) {
	return service.SysNotify().List(ctx, req)
}

func (s *sysNotifyController) Unread(ctx context.Context, req *v1.GetUnreadNotificationReq) (res *v1.GetUnreadNotificationRes, err error) {
	return service.SysNotify().Unread(ctx, req)
}

func (s *sysNotifyController) ReadAll(ctx context.Context, req *v1.PutAllNotificationReadReq) (res *v1.PutAllNotificationReadRes, err error) {
	return service.SysNotify().ReadAll(ctx, req)
}

func (s *sysNotifyController) Delete(ctx context.Context, req *v1.DeleteNotificationReq) (res *v1.DeleteNotificationRes, err error) {
	return service.SysNotify().Delete(ctx, req)
}

func (s *sysNotifyController) DeleteAll(ctx context.Context, req *v1.DeleteAllNotificationReq) (res *v1.DeleteAllNotificationRes, err error) {
	return service.SysNotify().DeleteAll(ctx, req)
}
