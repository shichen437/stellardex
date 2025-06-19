// ================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// You can delete these comments if you wish manually maintain this interface file.
// ================================================================================

package service

import (
	"context"

	ext "github.com/shichen437/stellardex/api/ext/bookmark"
)

type (
	IExtBookmark interface {
		PostBookmark(ctx context.Context, req *ext.PostBookmarkReq) (res *ext.PostBookmarkRes, err error)
	}
)

var (
	localExtBookmark IExtBookmark
)

func ExtBookmark() IExtBookmark {
	if localExtBookmark == nil {
		panic("implement not found for interface IExtBookmark, forgot register?")
	}
	return localExtBookmark
}

func RegisterExtBookmark(i IExtBookmark) {
	localExtBookmark = i
}
