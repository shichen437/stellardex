package logic

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/util/gconv"

	v1 "github.com/shichen437/stellardex/api/v1/bookmark"
	"github.com/shichen437/stellardex/internal/app/bookmark/dao"
	"github.com/shichen437/stellardex/internal/app/bookmark/model"
	"github.com/shichen437/stellardex/internal/app/bookmark/model/do"
	"github.com/shichen437/stellardex/internal/app/bookmark/model/entity"
	"github.com/shichen437/stellardex/internal/app/bookmark/service"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	bmparser "github.com/shichen437/stellardex/internal/pkg/bm_parser"
	"github.com/shichen437/stellardex/internal/pkg/bookmark"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sUserBookmark struct{}
)

func init() {
	service.RegisterUserBookmark(New())
}

func New() service.IUserBookmark {
	return &sUserBookmark{}
}

func (s *sUserBookmark) Post(ctx context.Context, req *v1.PostBookmarkReq) (res *v1.PostBookmarkRes, err error) {
	res = &v1.PostBookmarkRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	article, ok := bmparser.ParseBookmark(ctx, bmparser.ArticleModel{
		Url:    req.Url,
		UserId: uid,
	})
	if !ok {
		err = gerror.New("bookmark.error.ParseFailed")
		return
	}
	dao.UserBookmark.Ctx(ctx).Insert(do.UserBookmark{
		UserId:        uid,
		SourceUrl:     req.Url,
		Title:         article.Title,
		Author:        article.Byline,
		ContentHtml:   article.Content,
		ContentText:   article.TextContent,
		Excerpt:       article.Excerpt,
		WordCount:     article.Length,
		SiteName:      article.SiteName,
		ReadingTime:   article.ReadingTime,
		CoverImageUrl: article.CoverImageUrl,
		CreateAt:      utils.Now(),
	})
	return
}

func (s *sUserBookmark) Delete(ctx context.Context, req *v1.DeleteBookmarkReq) (res *v1.DeleteBookmarkRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	var bm *entity.UserBookmark
	dao.UserBookmark.Ctx(ctx).WherePri(req.Id).
		Where(dao.UserBookmark.Columns().UserId, uid).Scan(&bm)
	if bm == nil {
		return
	}
	dao.UserBookmark.Ctx(ctx).WherePri(req.Id).
		Where(dao.UserBookmark.Columns().UserId, uid).
		Delete()
	dao.BookmarkLabelRelation.Ctx(ctx).Where(dao.BookmarkLabelRelation.Columns().BookmarkId, req.Id).Delete()
	count, _ := dao.UserBookmark.Ctx(ctx).
		Where(dao.UserBookmark.Columns().UserId, uid).
		Where(dao.UserBookmark.Columns().SourceUrl, bm.SourceUrl).Count()
	if count <= 0 {
		bookmark.ClearInvalidImages(ctx, bm.SourceUrl, uid)
	}
	return
}

func (s *sUserBookmark) List(ctx context.Context, req *v1.GetBookmarkListReq) (res *v1.GetBookmarkListRes, err error) {
	res = &v1.GetBookmarkListRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}

	baseQuery := dao.UserBookmark.Ctx(ctx).Where(dao.UserBookmark.Columns().UserId, uid)
	ids, ok := dealLabelParams(ctx, req, uid)
	if !ok {
		return
	}
	baseQuery = dealQueryModel(req, baseQuery, ids)
	res.Total, err = baseQuery.Count()
	if err != nil {
		err = gerror.New("data.ListFailed")
		return
	}

	if res.Total > 0 {
		err = baseQuery.Fields(model.BookmarkModel{}).Page(req.PageNum, req.PageSize).Scan(&res.Rows)
		if err != nil {
			err = gerror.New("data.ListFailed")
			return
		}
	}
	return
}

func (s *sUserBookmark) Get(ctx context.Context, req *v1.GetBookmarkReq) (res *v1.GetBookmarkRes, err error) {
	res = &v1.GetBookmarkRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	bookmark := &entity.UserBookmark{}
	err = dao.UserBookmark.Ctx(ctx).Where(dao.UserBookmark.Columns().Id, req.Id).Scan(bookmark)
	if err != nil {
		return
	}
	res.Bookmark = bookmark
	return
}

func (s *sUserBookmark) Num(ctx context.Context, req *v1.GetBookmarkNumReq) (res *v1.GetBookmarkNumRes, err error) {
	res = &v1.GetBookmarkNumRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	m := dao.UserBookmark.Ctx(ctx).Where(dao.UserBookmark.Columns().UserId, uid)
	res.Total, err = m.Count()
	if err != nil {
		err = gerror.New("data.ListFailed")
		return
	}
	res.Unread, _ = m.Where(dao.UserBookmark.Columns().Status, 0).Count()
	res.Read, _ = m.Where(dao.UserBookmark.Columns().Status, 1).Count()
	res.Archive, _ = m.Where(dao.UserBookmark.Columns().IsArchive, 1).Count()
	res.Star, _ = m.Where(dao.UserBookmark.Columns().IsStarred, 1).Count()
	res.Label, _ = dao.BookmarkLabel.Ctx(ctx).Where(dao.BookmarkLabel.Columns().UserId, uid).Count()
	res.Selector, _ = dao.UserCustomSelector.Ctx(ctx).Where(dao.UserCustomSelector.Columns().UserId, uid).Count()
	return
}

func (s *sUserBookmark) Status(ctx context.Context, req *v1.PutBookmarkStatusReq) (res *v1.PutBookmarkStatusRes, err error) {
	res = &v1.PutBookmarkStatusRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	switch req.Type {
	case 1:
		_, err = dao.UserBookmark.Ctx(ctx).
			WherePri(req.Id).
			Where(dao.UserBookmark.Columns().UserId, uid).
			Update(do.UserBookmark{
				IsArchive: req.Status,
				UpdateAt:  utils.Now(),
			})
	case 2:
		_, err = dao.UserBookmark.Ctx(ctx).
			WherePri(req.Id).
			Where(dao.UserBookmark.Columns().UserId, uid).
			Update(do.UserBookmark{
				IsStarred: req.Status,
				UpdateAt:  utils.Now(),
			})
	default:
		_, err = dao.UserBookmark.Ctx(ctx).
			WherePri(req.Id).
			Where(dao.UserBookmark.Columns().UserId, uid).
			Update(do.UserBookmark{
				Status:   req.Status,
				UpdateAt: utils.Now(),
			})
	}
	return
}

func (s *sUserBookmark) Title(ctx context.Context, req *v1.PutBookmarkTitleReq) (res *v1.PutBookmarkTitleRes, err error) {
	res = &v1.PutBookmarkTitleRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	_, err = dao.UserBookmark.Ctx(ctx).
		WherePri(req.Id).
		Where(dao.UserBookmark.Columns().UserId, uid).
		Update(do.UserBookmark{
			Title:    req.Title,
			UpdateAt: utils.Now(),
		})
	return
}

func dealLabelParams(ctx context.Context, req *v1.GetBookmarkListReq, uid int) ([]int, bool) {
	var ids []int
	var results []*entity.BookmarkLabelRelation
	if req.Label != "" {
		var relations []*entity.BookmarkLabel
		var relationIds []int
		dao.BookmarkLabel.Ctx(ctx).
			Fields(dao.BookmarkLabel.Columns().Id).
			Where(dao.BookmarkLabel.Columns().UserId, uid).
			WhereLike(dao.BookmarkLabel.Columns().Name, "%"+req.Label+"%").
			Scan(&relations)
		if len(relations) <= 0 {
			return nil, false
		}
		for _, v := range relations {
			relationIds = append(relationIds, v.Id)
		}
		dao.BookmarkLabelRelation.Ctx(ctx).
			Fields(dao.BookmarkLabelRelation.Columns().BookmarkId).
			WhereIn(dao.BookmarkLabelRelation.Columns().LabelId, relationIds).
			Scan(&results)
		if len(results) > 0 {
			for _, v := range results {
				ids = append(ids, v.BookmarkId)
			}
			return ids, true
		}
		return nil, false
	}
	return nil, true
}

func dealQueryModel(req *v1.GetBookmarkListReq, baseQuery *gdb.Model, ids []int) *gdb.Model {
	if len(ids) > 0 {
		baseQuery = baseQuery.WhereIn(dao.UserBookmark.Columns().Id, ids)
	}
	if req.Keyword != "" {
		baseQuery = baseQuery.Where("title LIKE ? OR excerpt LIKE ? OR content_text LIKE ?",
			"%"+req.Keyword+"%",
			"%"+req.Keyword+"%",
			"%"+req.Keyword+"%")
	}
	if req.Author != "" {
		baseQuery = baseQuery.WhereLike(dao.UserBookmark.Columns().Author, "%"+req.Author+"%")
	}
	if req.Site != "" {
		baseQuery = baseQuery.WhereLike(dao.UserBookmark.Columns().SiteName, req.Site)
	}
	if req.Status != nil {
		baseQuery = baseQuery.Where(dao.UserBookmark.Columns().Status, req.Status)
	}
	if req.IsArchive != nil {
		baseQuery = baseQuery.Where(dao.UserBookmark.Columns().IsArchive, req.IsArchive)
	}
	if req.IsStarred != nil {
		baseQuery = baseQuery.Where(dao.UserBookmark.Columns().IsStarred, req.IsStarred)
	}
	baseQuery = dealSortParams(req, baseQuery)
	return baseQuery
}

func dealSortParams(req *v1.GetBookmarkListReq, baseQuery *gdb.Model) *gdb.Model {
	switch req.Sort {
	case "id:asc":
		baseQuery = baseQuery.OrderAsc(dao.UserBookmark.Columns().Id)
	case "siteName:asc":
		baseQuery = baseQuery.OrderAsc(dao.UserBookmark.Columns().SiteName)
	case "siteName:desc":
		baseQuery = baseQuery.OrderDesc(dao.UserBookmark.Columns().ReadingTime)
	case "readingTime:asc":
		baseQuery = baseQuery.OrderAsc(dao.UserBookmark.Columns().ReadingTime)
	case "readingTime:desc":
		baseQuery = baseQuery.OrderDesc(dao.UserBookmark.Columns().ReadingTime)
	default:
		baseQuery = baseQuery.OrderDesc(dao.UserBookmark.Columns().Id)
	}
	return baseQuery
}
