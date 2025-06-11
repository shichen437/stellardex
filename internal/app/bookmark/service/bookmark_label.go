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
	IBookmarkLabel interface {
		List(ctx context.Context, req *v1.GetBookmarkLabelsReq) (res *v1.GetBookmarkLabelsRes, err error)
		Post(ctx context.Context, req *v1.PostBookmarkLabelReq) (res *v1.PostBookmarkLabelRes, err error)
		Delete(ctx context.Context, req *v1.DeleteBookmarkLabelReq) (res *v1.DeleteBookmarkLabelRes, err error)
		ListUserLabels(ctx context.Context, req *v1.GetUserBookmarkLabelReq) (res *v1.GetUserBookmarkLabelRes, err error)
		PostUserLabel(ctx context.Context, req *v1.PostUserBookmarkLabelReq) (res *v1.PostUserBookmarkLabelRes, err error)
		PutUserLabel(ctx context.Context, req *v1.PutUserBookmarkLabelReq) (res *v1.PutUserBookmarkLabelRes, err error)
		DeleteUserLabel(ctx context.Context, req *v1.DeleteUserBookmarkLabelReq) (res *v1.DeleteUserBookmarkLabelRes, err error)
	}
)

var (
	localBookmarkLabel IBookmarkLabel
)

func BookmarkLabel() IBookmarkLabel {
	if localBookmarkLabel == nil {
		panic("implement not found for interface IBookmarkLabel, forgot register?")
	}
	return localBookmarkLabel
}

func RegisterBookmarkLabel(i IBookmarkLabel) {
	localBookmarkLabel = i
}
