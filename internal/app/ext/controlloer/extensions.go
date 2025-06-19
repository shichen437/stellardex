package controlloer

import (
	"context"

	extBookmark "github.com/shichen437/stellardex/api/ext/bookmark"
	ext "github.com/shichen437/stellardex/api/ext/connect"
	"github.com/shichen437/stellardex/internal/app/ext/service"
)

type extensionsController struct {
}

var Extensions = extensionsController{}

func (c *extensionsController) Connect(ctx context.Context, req *ext.GetConnectionReq) (res *ext.GetConnectionRes, err error) {
	return
}

func (c *extensionsController) PostBookmark(ctx context.Context, req *extBookmark.PostBookmarkReq) (res *extBookmark.PostBookmarkRes, err error) {
	return service.ExtBookmark().PostBookmark(ctx, req)
}
