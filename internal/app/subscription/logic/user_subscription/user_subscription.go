package logic

import (
	"context"
	"math"
	"sort"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/util/gconv"
	v1 "github.com/shichen437/stellardex/api/v1/subscription"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/subscription/dao"
	"github.com/shichen437/stellardex/internal/app/subscription/model"
	"github.com/shichen437/stellardex/internal/app/subscription/model/do"
	"github.com/shichen437/stellardex/internal/app/subscription/model/entity"
	"github.com/shichen437/stellardex/internal/app/subscription/service"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sUserSubscription struct{}
)

func init() {
	service.RegisterUserSubscription(New())
}

func New() service.IUserSubscription {
	return &sUserSubscription{}
}

func (s *sUserSubscription) List(ctx context.Context, req *v1.GetUserSubListReq) (res *v1.GetUserSubListRes, err error) {
	res = &v1.GetUserSubListRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	m := dao.UserSubscription.Ctx(ctx).
		Where(dao.UserSubscription.Columns().UserId, uid).
		OrderDesc(dao.UserSubscription.Columns().Id)
	res.Total, err = m.Count()
	if res.Total == 0 {
		return
	}
	err = m.Page(req.PageNum, req.PageSize).Scan(&res.Rows)
	if err != nil {
		err = utils.TError(ctx, "data.ListFailed")
	}
	var ids []int
	idMap := make(map[int]struct{})
	for _, row := range res.Rows {
		if _, exists := idMap[row.Currency]; !exists {
			ids = append(ids, row.Currency)
			idMap[row.Currency] = struct{}{}
		}
	}

	currencyMap, err := getCurrencyMap(ctx, ids)
	if err == nil && len(currencyMap) > 0 {
		for _, row := range res.Rows {
			row.CurrencySymbol = currencyMap[row.Currency]
		}
	}
	return res, nil
}

func (s *sUserSubscription) Timeline(ctx context.Context, req *v1.GetSubTimelineReq) (res *v1.GetSubTimelineRes, err error) {
	res = &v1.GetSubTimelineRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	var list []*entity.UserSubscription
	err = dao.UserSubscription.Ctx(ctx).
		Where(dao.UserSubscription.Columns().UserId, uid).
		Where(dao.UserSubscription.Columns().Status, 1).
		WhereGTE(dao.UserSubscription.Columns().NextDate, utils.Now()).
		OrderAsc(dao.UserSubscription.Columns().NextDate).
		Limit(20).
		Scan(&list)
	if err != nil {
		err = utils.TError(ctx, "data.ListFailed")
	}
	if len(list) <= 0 {
		return res, nil
	}
	res.Data = assembleTimelineData(list)
	return res, nil
}

func (s *sUserSubscription) Overview(ctx context.Context, req *v1.GetSubOverviewReq) (res *v1.GetSubOverviewRes, err error) {
	res = &v1.GetSubOverviewRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	res.Data = assembleOverview(ctx, uid)
	return res, nil
}

func (s *sUserSubscription) Post(ctx context.Context, req *v1.PostUserSubReq) (res *v1.PostUserSubRes, err error) {
	res = &v1.PostUserSubRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.UserSubscription.Ctx(ctx).Insert(do.UserSubscription{
		UserId:    uid,
		Title:     req.Title,
		Amount:    req.Amount,
		CycleNum:  req.CycleNum,
		CycleType: req.CycleType,
		CycleDay:  req.CycleDay,
		StartDate: req.StartDate,
		NextDate:  utils.CalcNextDate(req.CycleNum, req.CycleType, req.CycleDay, req.StartDate),
		Currency:  req.Currency,
		Category:  req.Category,
		Site:      req.Site,
		Status:    1,
		CreateAt:  utils.Now(),
	})
	if err != nil {
		err = utils.TError(ctx, "data.AddFailed")
	}
	return res, nil
}

func (s *sUserSubscription) Put(ctx context.Context, req *v1.PutUserSubReq) (res *v1.PutUserSubRes, err error) {
	res = &v1.PutUserSubRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.UserSubscription.Ctx(ctx).
		WherePri(req.Id).
		Where(dao.UserSubscription.Columns().UserId, uid).
		Update(do.UserSubscription{
			Title:     req.Title,
			Amount:    req.Amount,
			CycleNum:  req.CycleNum,
			CycleType: req.CycleType,
			CycleDay:  req.CycleDay,
			StartDate: req.StartDate,
			NextDate:  utils.CalcNextDate(req.CycleNum, req.CycleType, req.CycleDay, req.StartDate),
			Currency:  req.Currency,
			Category:  req.Category,
			Site:      req.Site,
			UpdateAt:  utils.Now(),
		})
	if err != nil {
		err = utils.TError(ctx, "data.UpdateFailed")
	}
	return res, nil
}

func (s *sUserSubscription) Delete(ctx context.Context, req *v1.DeleteUserSubReq) (res *v1.DeleteUserSubRes, err error) {
	res = &v1.DeleteUserSubRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.UserSubscription.Ctx(ctx).WherePri(req.Id).Delete()
	if err != nil {
		err = utils.TError(ctx, "data.DeleteFailed")
	}
	return res, nil
}

func (s *sUserSubscription) Enable(ctx context.Context, req *v1.PutEnableUserSubReq) (res *v1.PutEnableUserSubRes, err error) {
	res = &v1.PutEnableUserSubRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.UserSubscription.Ctx(ctx).
		WherePri(req.Id).
		Where(dao.UserSubscription.Columns().UserId, uid).
		Update(do.UserSubscription{
			Status:   1,
			UpdateAt: utils.Now(),
		})
	if err != nil {
		err = utils.TError(ctx, "data.UpdateFailed")
	}
	return res, nil
}

func (s *sUserSubscription) Disable(ctx context.Context, req *v1.PutDisableUserSubReq) (res *v1.PutDisableUserSubRes, err error) {
	res = &v1.PutDisableUserSubRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.UserSubscription.Ctx(ctx).
		WherePri(req.Id).
		Where(dao.UserSubscription.Columns().UserId, uid).
		Update(do.UserSubscription{
			Status:   0,
			UpdateAt: utils.Now(),
		})
	if err != nil {
		err = utils.TError(ctx, "data.UpdateFailed")
	}
	return res, nil
}

func getCurrencyMap(ctx context.Context, ids []int) (map[int]string, error) {
	var list []*entity.SysCurrency
	err := dao.SysCurrency.Ctx(ctx).
		Where(dao.SysCurrency.Columns().Id, ids).
		Scan(&list)
	if err != nil {
		return nil, err
	}
	if len(list) <= 0 {
		return nil, nil
	}
	currencyMap := make(map[int]string)
	for _, currency := range list {
		currencyMap[currency.Id] = currency.Symbol
	}
	return currencyMap, nil
}

func assembleOverview(ctx context.Context, uid int) *model.SubOverviewModel {
	m := dao.UserSubscription.Ctx(ctx).
		Where(dao.UserSubscription.Columns().UserId, uid)
	data := &model.SubOverviewModel{
		Total:          0,
		Active:         0,
		PerYearAmount:  0,
		PerMonthAmount: 0,
	}
	data.Total, _ = m.Count()
	data.Active, _ = m.Where(dao.UserSubscription.Columns().Status, 1).Count()
	var list []*entity.UserSubscription
	if data.Active > 0 {
		err := m.Where(dao.UserSubscription.Columns().Status, 1).
			WhereNot(dao.UserSubscription.Columns().CycleType, 0).
			Scan(&list)
		if err != nil || len(list) <= 0 {
			return data
		}
		var yearAmount float32
		yearAmount = 0
		rateMap, defaultRate, err := getCurrencyRateMap(ctx)
		if err != nil {
			return data
		}
		if defaultRate == 0 {
			defaultRate = 1
		}
		for _, sub := range list {
			currencyRate := defaultRate
			if currency, ok := rateMap[sub.Currency]; ok {
				currencyRate = currency.Rate
			}
			actualRate := defaultRate / currencyRate
			switch sub.CycleType {
			case 1:
				yearAmount += sub.Amount / float32(sub.CycleNum) * actualRate
			case 2:
				yearAmount += sub.Amount / float32(sub.CycleNum) * 4 * actualRate
			case 3:
				yearAmount += sub.Amount / float32(sub.CycleNum) * 12 * actualRate
			case 4:
				yearAmount += float32(sub.Amount/float32(sub.CycleNum)*52) * actualRate
			}
		}
		data.PerYearAmount = float32(math.Round(float64(yearAmount*100)) / 100)
		data.PerMonthAmount = float32(math.Round(float64(yearAmount/12*100)) / 100)
	}
	return data
}

func assembleTimelineData(list []*entity.UserSubscription) []*model.SubTimelineModel {
	dateMap := make(map[string]*model.SubTimelineModel)

	for _, sub := range list {
		nextDate := sub.NextDate.String()
		if existing, ok := dateMap[nextDate]; ok {
			existing.Title = existing.Title + ", " + sub.Title
		} else {
			dateMap[nextDate] = &model.SubTimelineModel{
				Title:    sub.Title,
				NextDate: sub.NextDate,
			}
		}
	}

	var timelineList []*model.SubTimelineModel
	for _, item := range dateMap {
		timelineList = append(timelineList, item)
	}

	sort.Slice(timelineList, func(i, j int) bool {
		return timelineList[i].NextDate.Before(timelineList[j].NextDate)
	})

	if len(timelineList) > 6 {
		timelineList = timelineList[:6]
	}
	return timelineList
}

func getCurrencyRateMap(ctx context.Context) (map[int]*entity.SysCurrency, float32, error) {
	var list []*entity.SysCurrency
	var defaultRate float32
	defaultRate = 1
	err := dao.SysCurrency.Ctx(ctx).Scan(&list)
	if err != nil {
		return nil, defaultRate, err
	}
	if len(list) <= 0 {
		return nil, defaultRate, nil
	}

	currencyMap := make(map[int]*entity.SysCurrency)
	for _, currency := range list {
		if currency.IsDefault == 1 {
			defaultRate = currency.Rate
		}
		currencyMap[currency.Id] = currency
	}
	return currencyMap, defaultRate, nil
}
