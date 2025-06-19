package logic

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/os/gtime"
	"github.com/gogf/gf/v2/util/gconv"

	v1 "github.com/shichen437/stellardex/api/v1/user"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/user/dao"
	"github.com/shichen437/stellardex/internal/app/user/model/do"
	"github.com/shichen437/stellardex/internal/app/user/service"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sApiKey struct{}
)

func init() {
	service.RegisterApiKey(New())
}

func New() service.IApiKey {
	return &sApiKey{}
}

func (a *sApiKey) List(ctx context.Context, req *v1.GetApiKeyListReq) (res *v1.GetApiKeyListRes, err error) {
	res = &v1.GetApiKeyListRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	m := dao.SysApiKey.Ctx(ctx).Where(dao.SysApiKey.Columns().UserId, uid)
	res.Total, err = m.Count()
	if res.Total > 0 {
		err = m.Page(req.PageNum, req.PageSize).Scan(&res.Rows)
	}
	return
}

func (a *sApiKey) Create(ctx context.Context, req *v1.PostApiKeyReq) (res *v1.PostApiKeyRes, err error) {
	res = &v1.PostApiKeyRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	apiKey := utils.CreateApiKey()
	var expiresAt *gtime.Time
	if req.ExpiresAt != "" {
		pTime, pErr := gtime.StrToTime(req.ExpiresAt)
		if pErr == nil {
			expiresAt = pTime
		}
	}
	_, err = dao.SysApiKey.Ctx(ctx).
		Data(&do.SysApiKey{
			UserId:     uid,
			ApiKeyName: req.ApiKeyName,
			ApiKey:     utils.HashApiKey(apiKey),
			ExpiresAt:  expiresAt,
			CreateAt:   utils.Now(),
		}).
		Insert()
	if err == nil {
		res.ApiKey = apiKey
	}
	return
}

func (a *sApiKey) Disable(ctx context.Context, req *v1.DisableApiKeyReq) (res *v1.DisableApiKeyRes, err error) {
	res = &v1.DisableApiKeyRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.SysApiKey.Ctx(ctx).
		Data(&do.SysApiKey{
			Status: 0,
		}).
		WherePri(req.Id).
		Where(dao.SysApiKey.Columns().UserId, uid).
		Update()
	return
}

func (a *sApiKey) Delete(ctx context.Context, req *v1.DeleteApiKeyReq) (res *v1.DeleteApiKeyRes, err error) {
	res = &v1.DeleteApiKeyRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.SysApiKey.Ctx(ctx).
		WherePri(req.Id).
		Where(dao.SysApiKey.Columns().UserId, uid).
		Delete()
	return
}
