package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/bookmark"
	"github.com/shichen437/stellardex/internal/app/bookmark/service"
)

type bookmarkLabelController struct {
}

var BookmarkLabel = bookmarkLabelController{}

func (s *bookmarkLabelController) List(ctx context.Context, req *v1.GetBookmarkLabelsReq) (res *v1.GetBookmarkLabelsRes, err error) {
	return service.BookmarkLabel().List(ctx, req)
}
func (s *bookmarkLabelController) Post(ctx context.Context, req *v1.PostBookmarkLabelReq) (res *v1.PostBookmarkLabelRes, err error) {
	return service.BookmarkLabel().Post(ctx, req)
}
func (s *bookmarkLabelController) Delete(ctx context.Context, req *v1.DeleteBookmarkLabelReq) (res *v1.DeleteBookmarkLabelRes, err error) {
	return service.BookmarkLabel().Delete(ctx, req)
}
func (s *bookmarkLabelController) ListUserLabels(ctx context.Context, req *v1.GetUserBookmarkLabelReq) (res *v1.GetUserBookmarkLabelRes, err error) {
	return service.BookmarkLabel().ListUserLabels(ctx, req)
}
func (s *bookmarkLabelController) PostUserLabel(ctx context.Context, req *v1.PostUserBookmarkLabelReq) (res *v1.PostUserBookmarkLabelRes, err error) {
	return service.BookmarkLabel().PostUserLabel(ctx, req)
}
func (s *bookmarkLabelController) PutUserLabel(ctx context.Context, req *v1.PutUserBookmarkLabelReq) (res *v1.PutUserBookmarkLabelRes, err error) {
	return service.BookmarkLabel().PutUserLabel(ctx, req)
}
func (s *bookmarkLabelController) DeleteUserLabel(ctx context.Context, req *v1.DeleteUserBookmarkLabelReq) (res *v1.DeleteUserBookmarkLabelRes, err error) {
	return service.BookmarkLabel().DeleteUserLabel(ctx, req)
}
