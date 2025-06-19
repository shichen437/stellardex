package logic

import (
	"context"
	"strings"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/util/gconv"
	ext "github.com/shichen437/stellardex/api/ext/bookmark"
	"github.com/shichen437/stellardex/internal/app/bookmark/dao"
	"github.com/shichen437/stellardex/internal/app/bookmark/model/do"
	"github.com/shichen437/stellardex/internal/app/bookmark/model/entity"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/ext/service"
	bmparser "github.com/shichen437/stellardex/internal/pkg/bm_parser"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sExtBookmark struct{}
)

func init() {
	service.RegisterExtBookmark(New())
}

func New() service.IExtBookmark {
	return &sExtBookmark{}
}

func (c *sExtBookmark) PostBookmark(ctx context.Context, req *ext.PostBookmarkReq) (res *ext.PostBookmarkRes, err error) {
	res = &ext.PostBookmarkRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("auth.UserIDEmpty")
		return
	}

	g.Log().Info(ctx, req)
	article, ok := bmparser.ParseBookmark(ctx, bmparser.ArticleModel{
		Url:      req.Url,
		UserId:   uid,
		IoReader: strings.NewReader(req.Content),
	})
	if !ok {
		err = gerror.New("bookmark.error.ParseFailed")
		return
	}
	lastInfo, err := dao.UserBookmark.Ctx(ctx).Insert(do.UserBookmark{
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
	if err != nil || len(req.Labels) == 0 {
		return
	}
	bookmarkLastId, err := lastInfo.LastInsertId()
	if err != nil {
		return
	}
	saveLabels(ctx, req, uid, bookmarkLastId)
	return
}

func saveLabels(ctx context.Context, req *ext.PostBookmarkReq, uid int, bookmarkLastId int64) {
	for _, name := range req.Labels {
		if strings.Trim(name, " ") == "" {
			continue
		}
		var label entity.BookmarkLabel
		dao.BookmarkLabel.Ctx(ctx).Where(dao.BookmarkLabel.Columns().UserId, uid).
			Where(dao.BookmarkLabel.Columns().Name, name).Limit(1).Scan(&label)
		if label.Id > 0 {
			dao.BookmarkLabelRelation.Ctx(ctx).Insert(do.BookmarkLabelRelation{
				LabelId:    label.Id,
				BookmarkId: bookmarkLastId,
			})
		} else {
			result, err := dao.BookmarkLabel.Ctx(ctx).Insert(do.BookmarkLabel{
				Name:     name,
				UserId:   uid,
				CreateAt: utils.Now(),
			})
			if err == nil && result != nil {
				labelLastId, err := result.LastInsertId()
				if err == nil && labelLastId > 0 {
					dao.BookmarkLabelRelation.Ctx(ctx).Insert(do.BookmarkLabelRelation{
						LabelId:    labelLastId,
						BookmarkId: bookmarkLastId,
					})
				}
			}
		}
	}
}
