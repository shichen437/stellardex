package logic

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/util/gconv"

	v1 "github.com/shichen437/stellardex/api/v1/group"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/group/dao"
	"github.com/shichen437/stellardex/internal/app/group/model/do"
	"github.com/shichen437/stellardex/internal/app/group/model/entity"
	"github.com/shichen437/stellardex/internal/app/group/service"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sUserGroupItem struct{}
)

func init() {
	service.RegisterUserGroupItem(New())
}

func New() service.IUserGroupItem {
	return &sUserGroupItem{}
}

func (s *sUserGroupItem) List(ctx context.Context, req *v1.GetGroupItemListReq) (res *v1.GetGroupItemListRes, err error) {
	res = &v1.GetGroupItemListRes{}
	var rows []*entity.UserGroupItem
	err = dao.UserGroupItem.Ctx(ctx).
		Where(dao.UserGroupItem.Columns().GroupId, req.GroupId).
		OrderAsc(dao.UserGroupItem.Columns().OrderNum).
		Scan(&rows)
	res.Rows = rows
	return
}

func (c *sUserGroupItem) Get(ctx context.Context, req *v1.GetGroupItemReq) (res *v1.GetGroupItemRes, err error) {
	res = &v1.GetGroupItemRes{}
	err = dao.UserGroupItem.Ctx(ctx).
		Where(dao.UserGroupItem.Columns().Id, req.Id).
		Scan(&res)
	return

}

func (c *sUserGroupItem) Add(ctx context.Context, req *v1.PostGroupItemReq) (res *v1.PostGroupItemRes, err error) {
	if !hasPermit(ctx, req.GroupId) {
		err = gerror.New("auth.NoPermission")
		return
	}
	num, err := dao.UserGroupItem.Ctx(ctx).
		Where(dao.UserGroupItem.Columns().GroupId, req.GroupId).
		Count()

	if err != nil {
		err = gerror.New("groupItem.error.Get")
		return
	}
	if num >= 99 {
		err = gerror.New("groupItem.error.NumLimit")
		return
	}
	dao.UserGroupItem.Ctx(ctx).Insert(do.UserGroupItem{
		GroupId:     req.GroupId,
		Title:       req.Title,
		Url:         req.Url,
		LanUrl:      req.LanUrl,
		Description: req.Description,
		IconType:    req.IconType,
		IconUrl:     req.IconUrl,
		BgColor:     req.BgColor,
		Opacity:     req.Opacity,
		OrderNum:    num + 1,
		CreateAt:    utils.Now(),
	})
	return
}

func (c *sUserGroupItem) Update(ctx context.Context, req *v1.PutGroupItemReq) (res *v1.PutGroupItemRes, err error) {
	if !hasPermit(ctx, req.GroupId) {
		err = gerror.New("auth.NoPermission")
		return
	}
	dao.UserGroupItem.Ctx(ctx).
		WherePri(req.Id).
		Update(do.UserGroupItem{
			Title:       req.Title,
			Url:         req.Url,
			LanUrl:      req.LanUrl,
			Description: req.Description,
			IconType:    req.IconType,
			IconUrl:     req.IconUrl,
			BgColor:     req.BgColor,
			Opacity:     req.Opacity,
			UpdateAt:    utils.Now(),
		})
	return
}

func (c *sUserGroupItem) Delete(ctx context.Context, req *v1.DeleteGroupItemReq) (res *v1.DeleteGroupItemRes, err error) {
	var sourceData *entity.UserGroupItem
	dao.UserGroupItem.Ctx(ctx).WherePri(req.Id).Scan(&sourceData)
	if sourceData == nil {
		return
	}
	if !hasPermit(ctx, sourceData.GroupId) {
		err = gerror.New("auth.NoPermission")
		return
	}
	var needUpdateData []*entity.UserGroupItem
	dao.UserGroupItem.Ctx(ctx).Where(dao.UserGroupItem.Columns().GroupId, sourceData.GroupId).
		WhereGT(dao.UserGroupItem.Columns().OrderNum, sourceData.OrderNum).Scan(&needUpdateData)
	_, err = dao.UserGroupItem.Ctx(ctx).
		WherePri(req.Id).
		Delete()
	for _, item := range needUpdateData {
		dao.UserGroupItem.Ctx(ctx).
			WherePri(item.Id).
			Update(do.UserGroupItem{
				OrderNum: item.OrderNum - 1,
				UpdateAt: utils.Now(),
			})
	}
	return
}

func (c *sUserGroupItem) LocalIcon(ctx context.Context, req *v1.PostLocalIconReq) (res *v1.PostLocalIconRes, err error) {
	res = &v1.PostLocalIconRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("user.valid.UserIdEmpty")
		return
	}
	file := req.Icon
	file.Filename = "aaa.png"
	name, err := file.Save(utils.ICONS_PATH, true)
	if err != nil {
		err = gerror.New("file.uploadError")
		return
	}
	res.IconUrl = "/icons/" + name
	return
}

func hasPermit(ctx context.Context, groupId int) bool {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		return false
	}
	var entity *entity.UserGroup
	dao.UserGroup.Ctx(ctx).
		Where(dao.UserGroup.Columns().Id, groupId).
		Where(dao.UserGroup.Columns().UserId, uid).
		Scan(&entity)
	return entity != nil
}
