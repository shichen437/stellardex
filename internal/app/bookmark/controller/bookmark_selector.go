package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/bookmark"
	"github.com/shichen437/stellardex/internal/app/bookmark/service"
)

type bookmarkSelectorController struct {
}

var BookmarkSelector = bookmarkSelectorController{}

func (c *bookmarkSelectorController) Get(ctx context.Context, req *v1.GetBookmarkSelectorReq) (res *v1.GetBookmarkSelectorRes, err error) {
	return service.BookmarkSelector().Get(ctx, req)
}
func (c *bookmarkSelectorController) List(ctx context.Context, req *v1.GetBookmarkSelectorListReq) (res *v1.GetBookmarkSelectorListRes, err error) {
	return service.BookmarkSelector().List(ctx, req)
}
func (c *bookmarkSelectorController) Post(ctx context.Context, req *v1.PostBookmarkSelectorReq) (res *v1.PostBookmarkSelectorRes, err error) {
	return service.BookmarkSelector().Post(ctx, req)
}
func (c *bookmarkSelectorController) Put(ctx context.Context, req *v1.PutBookmarkSelectorReq) (res *v1.PutBookmarkSelectorRes, err error) {
	return service.BookmarkSelector().Put(ctx, req)
}
func (c *bookmarkSelectorController) Delete(ctx context.Context, req *v1.DeleteBookmarkSelectorReq) (res *v1.DeleteBookmarkSelectorRes, err error) {
	return service.BookmarkSelector().Delete(ctx, req)
}
