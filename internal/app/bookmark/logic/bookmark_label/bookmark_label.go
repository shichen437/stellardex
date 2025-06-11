package logic

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/util/gconv"
	v1 "github.com/shichen437/stellardex/api/v1/bookmark"
	"github.com/shichen437/stellardex/internal/app/bookmark/dao"
	"github.com/shichen437/stellardex/internal/app/bookmark/model"
	"github.com/shichen437/stellardex/internal/app/bookmark/model/do"
	"github.com/shichen437/stellardex/internal/app/bookmark/model/entity"
	"github.com/shichen437/stellardex/internal/app/bookmark/service"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sBookmarkLabel struct{}
)

func init() {
	service.RegisterBookmarkLabel(New())
}

func New() service.IBookmarkLabel {
	return &sBookmarkLabel{}
}

func (s *sBookmarkLabel) List(ctx context.Context, req *v1.GetBookmarkLabelsReq) (res *v1.GetBookmarkLabelsRes, err error) {
	res = &v1.GetBookmarkLabelsRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	var relations []*entity.BookmarkLabelRelation
	dao.BookmarkLabelRelation.Ctx(ctx).
		Where(dao.BookmarkLabelRelation.Columns().BookmarkId, req.Id).Scan(&relations)
	if len(relations) > 0 {
		var labelIds []int
		for _, relation := range relations {
			labelIds = append(labelIds, relation.LabelId)
		}
		dao.BookmarkLabel.Ctx(ctx).
			Where(dao.BookmarkLabel.Columns().UserId, uid).
			WhereIn(dao.BookmarkLabel.Columns().Id, labelIds).
			Scan(&res.Rows)
	}
	return
}

func (s *sBookmarkLabel) Post(ctx context.Context, req *v1.PostBookmarkLabelReq) (res *v1.PostBookmarkLabelRes, err error) {
	res = &v1.PostBookmarkLabelRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	if req.LabelId != nil && *req.LabelId > 0 {
		count, err := dao.BookmarkLabelRelation.Ctx(ctx).Where(dao.BookmarkLabelRelation.Columns().BookmarkId, req.Id).
			Where(dao.BookmarkLabelRelation.Columns().LabelId, *req.LabelId).Count()
		if err == nil && count == 0 {
			dao.BookmarkLabelRelation.Ctx(ctx).Insert(do.BookmarkLabelRelation{
				LabelId:    *req.LabelId,
				BookmarkId: req.Id,
			})
		}
	} else if req.LabelName != "" {
		var label entity.BookmarkLabel
		dao.BookmarkLabel.Ctx(ctx).Where(dao.BookmarkLabel.Columns().UserId, uid).
			Where(dao.BookmarkLabel.Columns().Name, req.LabelName).Limit(1).Scan(&label)
		g.Log().Debugf(ctx, "label: %v", label)
		if label.Id > 0 {
			count, err := dao.BookmarkLabelRelation.Ctx(ctx).Where(dao.BookmarkLabelRelation.Columns().BookmarkId, req.Id).
				Where(dao.BookmarkLabelRelation.Columns().LabelId, label.Id).Count()
			if err == nil && count == 0 {
				dao.BookmarkLabelRelation.Ctx(ctx).Insert(do.BookmarkLabelRelation{
					LabelId:    label.Id,
					BookmarkId: req.Id,
				})
			}
		} else {
			result, err := dao.BookmarkLabel.Ctx(ctx).Insert(do.BookmarkLabel{
				Name:     req.LabelName,
				UserId:   uid,
				CreateAt: utils.Now(),
			})
			if err == nil && result != nil {
				lastId, err := result.LastInsertId()
				if err == nil && lastId > 0 {
					dao.BookmarkLabelRelation.Ctx(ctx).Insert(do.BookmarkLabelRelation{
						LabelId:    lastId,
						BookmarkId: req.Id,
					})
				}
			}
		}
	}
	return
}

func (s *sBookmarkLabel) Delete(ctx context.Context, req *v1.DeleteBookmarkLabelReq) (res *v1.DeleteBookmarkLabelRes, err error) {
	res = &v1.DeleteBookmarkLabelRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	dao.BookmarkLabelRelation.Ctx(ctx).Where(dao.BookmarkLabelRelation.Columns().BookmarkId, req.Id).
		Where(dao.BookmarkLabelRelation.Columns().LabelId, req.LabelId).Delete()
	return
}

func (s *sBookmarkLabel) ListUserLabels(ctx context.Context, req *v1.GetUserBookmarkLabelReq) (res *v1.GetUserBookmarkLabelRes, err error) {
	res = &v1.GetUserBookmarkLabelRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	var labels []*model.UserBmLabelModel
	m := dao.BookmarkLabel.Ctx(ctx).Where(dao.BookmarkLabel.Columns().UserId, uid)
	if req.Keyword != "" {
		m = m.WhereLike(dao.BookmarkLabel.Columns().Name, "%"+req.Keyword+"%")
		m = m.Page(1, 10)
	}
	m.Scan(&labels)

	if len(labels) > 0 {
		var labelIds []int
		for _, label := range labels {
			labelIds = append(labelIds, label.Id)
		}

		type LabelCount struct {
			LabelId int `json:"label_id"`
			Count   int `json:"count"`
		}
		var counts []LabelCount

		err = dao.BookmarkLabelRelation.Ctx(ctx).
			Fields("label_id, count(1) as count").
			WhereIn(dao.BookmarkLabelRelation.Columns().LabelId, labelIds).
			Group(dao.BookmarkLabelRelation.Columns().LabelId).
			Scan(&counts)

		if err == nil {
			countMap := make(map[int]int)
			for _, c := range counts {
				countMap[c.LabelId] = c.Count
			}

			for _, label := range labels {
				label.BmNum = countMap[label.Id]
			}
		}
	}
	res.Rows = labels
	return
}

func (s *sBookmarkLabel) PostUserLabel(ctx context.Context, req *v1.PostUserBookmarkLabelReq) (res *v1.PostUserBookmarkLabelRes, err error) {
	res = &v1.PostUserBookmarkLabelRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	count, err := dao.BookmarkLabel.Ctx(ctx).Where(dao.BookmarkLabel.Columns().UserId, uid).
		Where(dao.BookmarkLabel.Columns().Name, req.Name).Count()
	if err != nil {
		return
	}
	if count > 0 {
		err = gerror.New("bookmark.label.valid.NameExist")
		return
	}
	dao.BookmarkLabel.Ctx(ctx).Insert(do.BookmarkLabel{
		Name:     req.Name,
		UserId:   uid,
		CreateAt: utils.Now(),
	})
	return
}

func (s *sBookmarkLabel) PutUserLabel(ctx context.Context, req *v1.PutUserBookmarkLabelReq) (res *v1.PutUserBookmarkLabelRes, err error) {
	res = &v1.PutUserBookmarkLabelRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	count, err := dao.BookmarkLabel.Ctx(ctx).Where(dao.BookmarkLabel.Columns().UserId, uid).
		Where(dao.BookmarkLabel.Columns().Name, req.Name).
		WhereNot(dao.BookmarkLabel.Columns().Id, req.Id).
		Count()
	if err != nil {
		return
	}
	if count > 0 {
		err = gerror.New("bookmark.label.valid.NameExist")
		return
	}
	dao.BookmarkLabel.Ctx(ctx).WherePri(req.Id).Update(do.BookmarkLabel{
		Name:     req.Name,
		UserId:   uid,
		UpdateAt: utils.Now(),
	})
	return
}

func (s *sBookmarkLabel) DeleteUserLabel(ctx context.Context, req *v1.DeleteUserBookmarkLabelReq) (res *v1.DeleteUserBookmarkLabelRes, err error) {
	res = &v1.DeleteUserBookmarkLabelRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	dao.BookmarkLabel.Ctx(ctx).Where(dao.BookmarkLabel.Columns().Id, req.Id).
		Where(dao.BookmarkLabel.Columns().UserId, uid).Delete()
	dao.BookmarkLabelRelation.Ctx(ctx).Where(dao.BookmarkLabelRelation.Columns().LabelId, req.Id).Delete()
	return
}
