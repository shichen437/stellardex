// ================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// You can delete these comments if you wish manually maintain this interface file.
// ================================================================================

package service

import (
	"context"

	v1 "github.com/shichen437/stellardex/api/v1/bookmark"
)

type (
	IUserBookmark interface {
		Post(ctx context.Context, req *v1.PostBookmarkReq) (res *v1.PostBookmarkRes, err error)
		Delete(ctx context.Context, req *v1.DeleteBookmarkReq) (res *v1.DeleteBookmarkRes, err error)
		List(ctx context.Context, req *v1.GetBookmarkListReq) (res *v1.GetBookmarkListRes, err error)
		Get(ctx context.Context, req *v1.GetBookmarkReq) (res *v1.GetBookmarkRes, err error)
		Num(ctx context.Context, req *v1.GetBookmarkNumReq) (res *v1.GetBookmarkNumRes, err error)
		Status(ctx context.Context, req *v1.PutBookmarkStatusReq) (res *v1.PutBookmarkStatusRes, err error)
		Title(ctx context.Context, req *v1.PutBookmarkTitleReq) (res *v1.PutBookmarkTitleRes, err error)
		Site(ctx context.Context, req *v1.GetUserBookmarkSiteReq) (res *v1.GetUserBookmarkSiteRes, err error)
	}
)

var (
	localUserBookmark IUserBookmark
)

func UserBookmark() IUserBookmark {
	if localUserBookmark == nil {
		panic("implement not found for interface IUserBookmark, forgot register?")
	}
	return localUserBookmark
}

func RegisterUserBookmark(i IUserBookmark) {
	localUserBookmark = i
}
