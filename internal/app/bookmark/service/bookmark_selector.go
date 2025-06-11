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
	IBookmarkSelector interface {
		Get(ctx context.Context, req *v1.GetBookmarkSelectorReq) (res *v1.GetBookmarkSelectorRes, err error)
		List(ctx context.Context, req *v1.GetBookmarkSelectorListReq) (res *v1.GetBookmarkSelectorListRes, err error)
		Post(ctx context.Context, req *v1.PostBookmarkSelectorReq) (res *v1.PostBookmarkSelectorRes, err error)
		Put(ctx context.Context, req *v1.PutBookmarkSelectorReq) (res *v1.PutBookmarkSelectorRes, err error)
		Delete(ctx context.Context, req *v1.DeleteBookmarkSelectorReq) (res *v1.DeleteBookmarkSelectorRes, err error)
	}
)

var (
	localBookmarkSelector IBookmarkSelector
)

func BookmarkSelector() IBookmarkSelector {
	if localBookmarkSelector == nil {
		panic("implement not found for interface IBookmarkSelector, forgot register?")
	}
	return localBookmarkSelector
}

func RegisterBookmarkSelector(i IBookmarkSelector) {
	localBookmarkSelector = i
}
