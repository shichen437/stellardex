package logic

import (
	"context"
	"net/url"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/util/gconv"
	v1 "github.com/shichen437/stellardex/api/v1/bookmark"
	"github.com/shichen437/stellardex/internal/app/bookmark/dao"
	"github.com/shichen437/stellardex/internal/app/bookmark/model/do"
	"github.com/shichen437/stellardex/internal/app/bookmark/service"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sBookmarkSelector struct{}
)

func init() {
	service.RegisterBookmarkSelector(New())
}

func New() service.IBookmarkSelector {
	return &sBookmarkSelector{}
}

func (s *sBookmarkSelector) Get(ctx context.Context, req *v1.GetBookmarkSelectorReq) (res *v1.GetBookmarkSelectorRes, err error) {
	res = &v1.GetBookmarkSelectorRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	err = dao.UserCustomSelector.Ctx(ctx).WherePri(req.Id).Where(dao.UserCustomSelector.Columns().UserId, uid).Scan(&res.Data)
	return
}

func (s *sBookmarkSelector) List(ctx context.Context, req *v1.GetBookmarkSelectorListReq) (res *v1.GetBookmarkSelectorListRes, err error) {
	res = &v1.GetBookmarkSelectorListRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	m := dao.UserCustomSelector.Ctx(ctx).Where(dao.UserCustomSelector.Columns().UserId, uid)
	if req.Keyword != "" {
		m = m.WhereLike(dao.UserCustomSelector.Columns().Domain, "%"+req.Keyword+"%")
	}
	res.Total, err = m.Count()
	if err != nil || res.Total == 0 {
		return
	}
	err = m.Page(req.PageNum, req.PageSize).OrderDesc(dao.UserCustomSelector.Columns().Id).Scan(&res.Rows)
	return
}

func (s *sBookmarkSelector) Post(ctx context.Context, req *v1.PostBookmarkSelectorReq) (res *v1.PostBookmarkSelectorRes, err error) {
	res = &v1.PostBookmarkSelectorRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	pUrl, err := url.Parse(req.Domain)
	if err != nil || pUrl == nil || pUrl.Host == "" {
		err = gerror.New("bookmark.selector.valid.DomainInvalid")
		return
	}
	req.Domain = pUrl.Scheme + "://" + pUrl.Host
	count, err := dao.UserCustomSelector.Ctx(ctx).Where(dao.UserCustomSelector.Columns().UserId, uid).
		Where(dao.UserCustomSelector.Columns().Domain, req.Domain).Count()
	if count > 0 {
		err = gerror.New("bookmark.selector.valid.DomainExist")
		return
	}
	dao.UserCustomSelector.Ctx(ctx).Insert(do.UserCustomSelector{
		UserId:        uid,
		Domain:        req.Domain,
		Title:         req.Title,
		Content:       req.Content,
		Byline:        req.Byline,
		Excerpt:       req.Excerpt,
		PublishedTime: req.PublishedTime,
		Cookie:        req.Cookie,
		CreateAt:      utils.Now(),
	})
	return
}

func (s *sBookmarkSelector) Put(ctx context.Context, req *v1.PutBookmarkSelectorReq) (res *v1.PutBookmarkSelectorRes, err error) {
	res = &v1.PutBookmarkSelectorRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	pUrl, err := url.Parse(req.Domain)
	if err != nil || pUrl == nil || pUrl.Host == "" {
		err = gerror.New("bookmark.selector.valid.DomainInvalid")
		return
	}
	req.Domain = pUrl.Scheme + "://" + pUrl.Host
	count, err := dao.UserCustomSelector.Ctx(ctx).Where(dao.UserCustomSelector.Columns().UserId, uid).
		Where(dao.UserCustomSelector.Columns().Domain, req.Domain).
		WhereNot(dao.UserCustomSelector.Columns().Id, req.Id).
		Count()
	if count > 0 {
		err = gerror.New("bookmark.selector.valid.DomainExist")
		return
	}
	dao.UserCustomSelector.Ctx(ctx).WherePri(req.Id).Where(dao.UserCustomSelector.Columns().UserId, uid).Update(do.UserCustomSelector{
		Domain:        req.Domain,
		Title:         req.Title,
		Content:       req.Content,
		Byline:        req.Byline,
		Excerpt:       req.Excerpt,
		PublishedTime: req.PublishedTime,
		Cookie:        req.Cookie,
		UpdateAt:      utils.Now(),
	})
	return
}

func (s *sBookmarkSelector) Delete(ctx context.Context, req *v1.DeleteBookmarkSelectorReq) (res *v1.DeleteBookmarkSelectorRes, err error) {
	res = &v1.DeleteBookmarkSelectorRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	dao.UserCustomSelector.Ctx(ctx).WherePri(req.Id).Where(dao.UserCustomSelector.Columns().UserId, uid).Delete()
	return
}
