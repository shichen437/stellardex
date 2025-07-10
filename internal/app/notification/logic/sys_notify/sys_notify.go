package logic

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/util/gconv"
	v1 "github.com/shichen437/stellardex/api/v1/notification"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/notification/dao"
	"github.com/shichen437/stellardex/internal/app/notification/model/do"
	"github.com/shichen437/stellardex/internal/app/notification/service"
)

type (
	sSysNotify struct{}
)

func init() {
	service.RegisterSysNotify(New())
}

func New() service.ISysNotify {
	return &sSysNotify{}
}

func (s *sSysNotify) List(ctx context.Context, req *v1.GetNotificationListReq) (res *v1.GetNotificationListRes, err error) {
	res = &v1.GetNotificationListRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	m := dao.SysNotify.Ctx(ctx).Where(dao.SysNotify.Columns().UserId, uid)
	if req.Status != nil {
		m = m.Where(dao.SysNotify.Columns().Status, *req.Status)
	}
	if req.Type != nil {
		m = m.Where(dao.SysNotify.Columns().Type, *req.Type)
	}
	m = m.OrderDesc(dao.SysNotify.Columns().Id)
	res.Total, err = m.Count()
	if err != nil {
		err = gerror.New("data.ListFailed")
		return
	}
	if res.Total > 0 {
		err = m.Page(req.PageNum, req.PageSize).Scan(&res.Rows)
		if err != nil {
			err = gerror.New("data.ListFailed")
			return
		}
	}
	return
}

func (s *sSysNotify) Unread(ctx context.Context, req *v1.GetUnreadNotificationReq) (res *v1.GetUnreadNotificationRes, err error) {
	res = &v1.GetUnreadNotificationRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	m := dao.SysNotify.Ctx(ctx).
		Where(dao.SysNotify.Columns().UserId, uid).
		Where(dao.SysNotify.Columns().Status, 0).
		OrderDesc(dao.SysNotify.Columns().Id)
	res.Num, err = m.Count()
	if err != nil {
		err = gerror.New("data.ListFailed")
		return
	}
	if res.Num > 0 {
		err = m.Page(1, 3).Scan(&res.Rows)
		if err != nil {
			err = gerror.New("data.ListFailed")
			return
		}
	}
	return
}

func (s *sSysNotify) ReadAll(ctx context.Context, req *v1.PutAllNotificationReadReq) (res *v1.PutAllNotificationReadRes, err error) {
	res = &v1.PutAllNotificationReadRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.SysNotify.Ctx(ctx).
		Where(dao.SysNotify.Columns().UserId, uid).
		Where(dao.SysNotify.Columns().Status, 0).
		Update(do.SysNotify{
			Status: 1,
		})
	if err != nil {
		err = gerror.New("data.UpdateFailed")
		return
	}
	return
}

func (s *sSysNotify) Delete(ctx context.Context, req *v1.DeleteNotificationReq) (res *v1.DeleteNotificationRes, err error) {
	res = &v1.DeleteNotificationRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	dao.SysNotify.Ctx(ctx).
		Where(dao.SysNotify.Columns().UserId, uid).
		Where(dao.SysNotify.Columns().Id, req.Id).Delete()
	return
}

func (s *sSysNotify) DeleteAll(ctx context.Context, req *v1.DeleteAllNotificationReq) (res *v1.DeleteAllNotificationRes, err error) {
	res = &v1.DeleteAllNotificationRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	dao.SysNotify.Ctx(ctx).Where(dao.SysNotify.Columns().UserId, uid).Delete()
	return
}
