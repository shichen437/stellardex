package logic

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/util/gconv"
	v1 "github.com/shichen437/stellardex/api/v1/subscription"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/subscription/dao"
	"github.com/shichen437/stellardex/internal/app/subscription/model/do"
	"github.com/shichen437/stellardex/internal/app/subscription/model/entity"
	"github.com/shichen437/stellardex/internal/app/subscription/service"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sSysCurrency struct{}
)

func init() {
	service.RegisterSysCurrency(New())
}

func New() service.ISysCurrency {
	return &sSysCurrency{}
}

func (s *sSysCurrency) List(ctx context.Context, req *v1.GetCurrencyListReq) (res *v1.GetCurrencyListRes, err error) {
	res = &v1.GetCurrencyListRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	m := dao.SysCurrency.Ctx(ctx)
	if req.Code != "" {
		m = m.WhereLike(dao.SysCurrency.Columns().Code, "%"+req.Code+"%")
	}
	m = m.OrderDesc(dao.SysCurrency.Columns().IsDefault).
		OrderAsc(dao.SysCurrency.Columns().Sort)
	res.Total, err = m.Count()
	if res.Total <= 0 || err != nil {
		return
	}
	var list []*entity.SysCurrency
	m.Page(req.PageNum, req.PageSize).Scan(&list)
	res.Rows = list
	return res, nil
}

func (s *sSysCurrency) Post(ctx context.Context, req *v1.PostCurrencyReq) (res *v1.PostCurrencyRes, err error) {
	res = &v1.PostCurrencyRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.SysCurrency.Ctx(ctx).Insert(do.SysCurrency{
		Code:      req.Code,
		Symbol:    req.Symbol,
		Rate:      req.Rate,
		Sort:      req.Sort,
		IsDefault: 0,
		CreateAt:  utils.Now(),
	})
	if err != nil {
		err = utils.TError(ctx, "data.AddFailed")
		return
	}
	return res, nil
}

func (s *sSysCurrency) Put(ctx context.Context, req *v1.PutCurrencyReq) (res *v1.PutCurrencyRes, err error) {
	res = &v1.PutCurrencyRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.SysCurrency.Ctx(ctx).
		WherePri(req.Id).
		Update(do.SysCurrency{
			Code:     req.Code,
			Symbol:   req.Symbol,
			Rate:     req.Rate,
			Sort:     req.Sort,
			UpdateAt: utils.Now(),
		})
	if err != nil {
		err = utils.TError(ctx, "data.UpdateFailed")
		return
	}
	return res, nil
}

func (s *sSysCurrency) Delete(ctx context.Context, req *v1.DeleteCurrencyReq) (res *v1.DeleteCurrencyRes, err error) {
	res = &v1.DeleteCurrencyRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	count, err := dao.UserSubscription.Ctx(ctx).Where(dao.UserSubscription.Columns().Currency, req.Id).Count()
	if err != nil {
		err = utils.TError(ctx, "data.DeleteFailed")
		return
	}
	if count > 0 {
		err = utils.TError(ctx, "sub.currency.error.isUsing")
		return
	}
	_, err = dao.SysCurrency.Ctx(ctx).WherePri(req.Id).Delete()
	if err != nil {
		err = utils.TError(ctx, "data.DeleteFailed")
	}
	return res, nil
}

func (s *sSysCurrency) Default(ctx context.Context, req *v1.PutCurrencyDefaultReq) (res *v1.PutCurrencyDefaultRes, err error) {
	res = &v1.PutCurrencyDefaultRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	dao.SysCurrency.Ctx(ctx).
		WherePri(req.Id).
		Update(do.SysCurrency{
			IsDefault: 1,
		})
	dao.SysCurrency.Ctx(ctx).
		WhereNot(dao.SysCurrency.Columns().Id, req.Id).
		Update(do.SysCurrency{
			IsDefault: 0,
		})
	return
}

func (s *sSysCurrency) GetDefault(ctx context.Context, req *v1.GetCurrencyDefaultReq) (res *v1.GetCurrencyDefaultRes, err error) {
	res = &v1.GetCurrencyDefaultRes{}
	var result *entity.SysCurrency
	dao.SysCurrency.Ctx(ctx).
		Where(dao.SysCurrency.Columns().IsDefault, 1).
		Limit(1).Scan(&result)
	res.Data = result
	return res, nil
}
