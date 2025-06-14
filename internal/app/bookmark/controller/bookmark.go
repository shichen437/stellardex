package controller

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/bookmark"
	"github.com/shichen437/stellardex/internal/app/bookmark/service"
)

type userBookmarkController struct {
}

var UserBookmark = userBookmarkController{}

func (s *userBookmarkController) Post(ctx context.Context, req *v1.PostBookmarkReq) (res *v1.PostBookmarkRes, err error) {
	return service.UserBookmark().Post(ctx, req)
}

func (s *userBookmarkController) Delete(ctx context.Context, req *v1.DeleteBookmarkReq) (res *v1.DeleteBookmarkRes, err error) {
	return service.UserBookmark().Delete(ctx, req)
}

func (s *userBookmarkController) List(ctx context.Context, req *v1.GetBookmarkListReq) (res *v1.GetBookmarkListRes, err error) {
	return service.UserBookmark().List(ctx, req)
}

func (s *userBookmarkController) Get(ctx context.Context, req *v1.GetBookmarkReq) (res *v1.GetBookmarkRes, err error) {
	return service.UserBookmark().Get(ctx, req)
}

func (s *userBookmarkController) Num(ctx context.Context, req *v1.GetBookmarkNumReq) (res *v1.GetBookmarkNumRes, err error) {
	return service.UserBookmark().Num(ctx, req)
}

func (s *userBookmarkController) Status(ctx context.Context, req *v1.PutBookmarkStatusReq) (res *v1.PutBookmarkStatusRes, err error) {
	return service.UserBookmark().Status(ctx, req)
}

func (s *userBookmarkController) Title(ctx context.Context, req *v1.PutBookmarkTitleReq) (res *v1.PutBookmarkTitleRes, err error) {
	return service.UserBookmark().Title(ctx, req)
}

func (s *userBookmarkController) Site(ctx context.Context, req *v1.GetUserBookmarkSiteReq) (res *v1.GetUserBookmarkSiteRes, err error) {
	return service.UserBookmark().Site(ctx, req)
}
