package system

import (
	"context"

	"github.com/shichen437/stellardex/internal/app/subscription/dao"
	"github.com/shichen437/stellardex/internal/app/subscription/model/do"
	"github.com/shichen437/stellardex/internal/app/subscription/model/entity"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

func SubUpdateAndNotify(ctx context.Context) {
	subscriptions := getActiveSubscriptions(ctx)
	if len(subscriptions) <= 0 {
		return
	}
	now := utils.Now()
	for _, sub := range subscriptions {
		if sub.NextDate == nil || sub.StartDate == nil {
			continue
		}
		if !sub.NextDate.After(now) {
			nextDate := utils.CalcNextDate(sub.CycleNum, sub.CycleType, sub.CycleDay, sub.StartDate)
			dao.UserSubscription.Ctx(ctx).Update(do.UserSubscription{
				Id:       sub.Id,
				NextDate: nextDate,
				UpdateAt: utils.Now(),
			})
			sub.NextDate = nextDate
		}
		between := utils.ClacDateBetween(now, sub.NextDate)
		if between == 3 && sub.CycleType != 4 {
			utils.SendNotification(ctx,
				utils.T(ctx, "subscription.notify.title"),
				utils.Tf(ctx, "subscription.notify.expired.3", sub.Title), 1, 0)
		}
		if between == 1 {
			utils.SendNotification(ctx,
				utils.T(ctx, "subscription.notify.title"),
				utils.Tf(ctx, "subscription.notify.expired.1", sub.Title), 1, 0)
		}
	}
}

func getActiveSubscriptions(ctx context.Context) []*entity.UserSubscription {
	var subscriptions []*entity.UserSubscription
	m := dao.UserSubscription.Ctx(ctx).
		Where(dao.UserSubscription.Columns().Status, 1).
		WhereNot(dao.UserSubscription.Columns().CycleType, 0)
	total, err := m.Count()
	if err != nil || total <= 0 {
		return subscriptions
	}
	m.Scan(&subscriptions)
	return subscriptions
}
