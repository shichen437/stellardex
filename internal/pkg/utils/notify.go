package utils

import (
	"context"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/internal/app/notification/dao"
	"github.com/shichen437/stellardex/internal/app/notification/model/do"
)

func SendNotification(ctx context.Context, title, content string, uid, nType int) {
	lastInfo, err := dao.SysNotify.Ctx(ctx).Insert(do.SysNotify{
		UserId:   uid,
		Title:    title,
		Content:  content,
		Status:   0,
		Type:     nType,
		CreateAt: Now(),
	})
	if err != nil {
		g.Log().Error(ctx, err)
		return
	}
	nid, err := lastInfo.LastInsertId()
	if err != nil {
		g.Log().Error(ctx, err)
		return
	}
	g.Log().Info(ctx, "send notification", nid)
}
