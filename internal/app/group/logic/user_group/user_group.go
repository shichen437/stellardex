package logic

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
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
	sUserGroup struct{}
)

func init() {
	service.RegisterUserGroup(New())
}

func New() service.IUserGroup {
	return &sUserGroup{}
}

func (s *sUserGroup) List(ctx context.Context, req *v1.GetGroupListReq) (res *v1.GetGroupListRes, err error) {
	res = &v1.GetGroupListRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	var list []*entity.UserGroup
	err = dao.UserGroup.Ctx(ctx).
		Where(dao.UserGroup.Columns().UserId, uid).
		OrderAsc(dao.UserGroup.Columns().OrderNum).
		Scan(&list)
	res.Rows = list
	return
}

func (c *sUserGroup) Get(ctx context.Context, req *v1.GetGroupReq) (res *v1.GetGroupRes, err error) {
	return

}

func (c *sUserGroup) Add(ctx context.Context, req *v1.PostGroupReq) (res *v1.PostGroupRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	checked := checkGroupName(ctx, uid, 0, req.Name)
	if !checked {
		err = gerror.New("group.valid.GroupNameExists")
		return
	}
	orderNum, _ := dao.UserGroup.Ctx(ctx).
		Where(dao.UserGroup.Columns().UserId, uid).
		Count()
	_, err = dao.UserGroup.Ctx(ctx).Insert(do.UserGroup{
		GroupName:   req.Name,
		DisplayType: req.DisplayType,
		IsShow:      1,
		OrderNum:    orderNum + 1,
		UserId:      uid,
		CreateAt:    utils.Now(),
	})
	return
}

func (c *sUserGroup) Update(ctx context.Context, req *v1.PutGroupReq) (res *v1.PutGroupRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	checked := checkGroupName(ctx, uid, req.Id, req.Name)
	if !checked {
		err = gerror.New("group.valid.GroupNameExists")
		return
	}
	_, err = dao.UserGroup.Ctx(ctx).
		Where(dao.UserGroup.Columns().Id, req.Id).
		Where(dao.UserGroup.Columns().UserId, uid).
		Update(do.UserGroup{
			GroupName:   req.Name,
			DisplayType: req.DisplayType,
			UpdateAt:    utils.Now(),
		})
	return
}

func (c *sUserGroup) Delete(ctx context.Context, req *v1.DeleteGroupReq) (res *v1.DeleteGroupRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	result, err := dao.UserGroup.Ctx(ctx).
		Where(dao.UserGroup.Columns().Id, req.Id).
		Where(dao.UserGroup.Columns().UserId, uid).
		Delete()
	if err == nil {
		num, err := result.RowsAffected()
		if err == nil && num > 0 {
			dao.UserGroupItem.Ctx(ctx).
				Where(dao.UserGroupItem.Columns().GroupId, req.Id).
				Delete()
		}
	}
	return
}

func (c *sUserGroup) UpdateVisible(ctx context.Context, req *v1.PutGroupVisibleReq) (res *v1.PutGroupVisibleRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.UserGroup.Ctx(ctx).
		Where(dao.UserGroup.Columns().Id, req.Id).
		Where(dao.UserGroup.Columns().UserId, uid).
		Update(do.UserGroup{
			IsShow:   req.IsShow,
			UpdateAt: utils.Now(),
		})
	return
}

func (c *sUserGroup) UpdateOrder(ctx context.Context, req *v1.PutGroupOrderReq) (res *v1.PutGroupOrderRes, err error) {
	groups := req.Groups
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	if groups == nil || len(groups) == 0 {
		return
	}
	validGroups := make([]*v1.GroupOrder, 0, len(groups))
	for _, group := range groups {
		if group.Id != 0 && group.OrderNum != 0 {
			validGroups = append(validGroups, group)
		}
	}
	if validGroups == nil || len(validGroups) == 0 {
		return
	}
	err = dao.UserGroup.Ctx(ctx).Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		for _, group := range validGroups {
			_, err := dao.UserGroup.Ctx(ctx).
				Where(dao.UserGroup.Columns().Id, group.Id).
				Where(dao.UserGroup.Columns().UserId, uid).
				Update(do.UserGroup{
					OrderNum: group.OrderNum,
					UpdateAt: utils.Now(),
				})
			if err != nil {
				return err
			}
		}
		return nil
	})
	return
}

func checkGroupName(ctx context.Context, uid, groupId int, name string) bool {
	m := dao.UserGroup.Ctx(ctx).
		Where(dao.UserGroup.Columns().UserId, uid).
		Where(dao.UserGroup.Columns().GroupName, name)
	if groupId != 0 {
		m = m.WhereNot(dao.UserGroup.Columns().Id, groupId)
	}
	num, _ := m.Count()
	return num == 0
}
