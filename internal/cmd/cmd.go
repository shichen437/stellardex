package cmd

import (
	"context"
	"fmt"
	"os"

	"github.com/goflyfox/gtoken/gtoken"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gcmd"
	"github.com/gogf/gf/v2/util/gconv"

	"github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/common/service"

	bookmark "github.com/shichen437/stellardex/internal/app/bookmark/controller"
	extensions "github.com/shichen437/stellardex/internal/app/ext/controlloer"
	userGroup "github.com/shichen437/stellardex/internal/app/group/controller"
	notify "github.com/shichen437/stellardex/internal/app/notification/controller"
	settings "github.com/shichen437/stellardex/internal/app/settings/controller"
	subscription "github.com/shichen437/stellardex/internal/app/subscription/controller"
	user "github.com/shichen437/stellardex/internal/app/user/controller"

	"github.com/shichen437/stellardex/internal/app/user/dao"
	"github.com/shichen437/stellardex/internal/app/user/model/do"
	"github.com/shichen437/stellardex/internal/app/user/model/entity"
	"github.com/shichen437/stellardex/internal/pkg/sse"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

var (
	Main = gcmd.Command{
		Name:  "main",
		Usage: "main",
		Brief: "Stellardex backend api",
		Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
			g.Log().Info(ctx, "Starting HTTP Server...")
			gfToken, err := GetGtoken(ctx)
			if err != nil {
				g.Log().Error(ctx, err)
				return err
			}
			initDir()
			s := g.Server()
			s.SetGraceful(true)
			s.SetIndexFolder(true)
			s.SetServerRoot(utils.UPLOAD_PATH)
			s.AddSearchPath(utils.UPLOAD_PATH)
			s.AddStaticPath("/upload", utils.UPLOAD_PATH)
			s.SetSwaggerUITemplate(consts.MySwaggerUITemplate)
			s.Use(service.Middleware().HandlerResponse)
			s.Group("/", func(group *ghttp.RouterGroup) {
				group.Middleware(
					service.Middleware().Ctx,
					ghttp.MiddlewareCORS,
				)
				group.Group("/ext", func(group *ghttp.RouterGroup) {
					group.Middleware(service.ApiKeyMiddleware().ApiKeyMiddleware)
					group.Bind(extensions.Extensions)
					group.Middleware(service.Middleware().CORS)
				})
				group.Group("/", func(group *ghttp.RouterGroup) {
					err = gfToken.Middleware(ctx, group)
					if err != nil {
						panic(err)
					}
					group.ALL("/sse", sse.HandleSSE)
					bindRoute(group)
				})
			})
			JobInit()
			s.Run()
			return nil
		},
	}
)

func GetGtoken(ctx context.Context) (gfToken *gtoken.GfToken, err error) {
	gfToken = &gtoken.GfToken{
		AuthAfterFunc:    AuthAfterFunc,
		AuthExcludePaths: g.SliceStr{"/logout", "/settings/lang", "/ext/*"},
		AuthPaths:        g.SliceStr{"/*"},
		CacheMode:        3,
		Timeout:          30 * 86400 * 1000,
		LoginBeforeFunc:  LoginFunc,
		LoginPath:        "/login",
		LogoutAfterFunc:  LogoutAfterFunc,
		LogoutPath:       "post:/logout",
		MultiLogin:       consts.MultiLogin,
		ServerName:       consts.ServerName,
	}
	err = gfToken.Start()
	return
}

func LoginFunc(r *ghttp.Request) (string, interface{}) {
	ctx := context.TODO()
	username := r.Get("username").String()
	password := r.Get("password").String()
	if username == "" || password == "" {
		r.Response.WriteJson(gtoken.Fail(utils.T(r.Context(), "auth.PassportEmpty")))
		r.ExitAll()
	}
	var users *entity.SysUser
	enc, _ := utils.Encrypt(ctx, password)
	err := dao.SysUser.Ctx(ctx).Where(do.SysUser{
		Username: username,
		Password: enc,
	}).Scan(&users)
	if err != nil || users == nil {
		r.Response.WriteJson(gtoken.Fail(utils.T(ctx, "auth.PassportError")))
		r.ExitAll()
	}
	if users.Status == consts.DisableStatus {
		r.Response.WriteJson(gtoken.Fail(utils.T(ctx, "auth.UserDisabled")))
		r.ExitAll()
	}
	return fmt.Sprintf("%s%d", consts.GTokenAdminPrefix, users.Id), users
}

func LogoutAfterFunc(r *ghttp.Request, respData gtoken.Resp) {
	service.Session().RemoveUser(r.Context())
	r.Middleware.Next()
}

func AuthAfterFunc(r *ghttp.Request, respData gtoken.Resp) {
	var users entity.SysUser
	err := gconv.Struct(respData.GetString("data"), &users)
	if err != nil {
		r.Response.WriteJson(gtoken.Unauthorized(utils.T(r.Context(), "auth.Unauthorized"), nil))
		r.ExitAll()
	}
	service.Session().SetUser(r.Context(), &users)
	r.SetCtxVar(consts.CtxAdminId, users.Id)
	r.SetCtxVar(consts.CtxAdminName, users.Username)
	r.Middleware.Next()
}

func initDir() {
	os.MkdirAll(utils.AVATAR_PATH, os.ModePerm)
}

func bindRoute(group *ghttp.RouterGroup) {
	group.Bind(
		user.SysUser,
		user.SysRole,
		user.ApiKey,
		userGroup.UserGroup,
		userGroup.UserGroupItem,
		settings.UserSettings,
		bookmark.UserBookmark,
		bookmark.BookmarkLabel,
		bookmark.BookmarkSelector,
		notify.SysNotify,
		subscription.SysCurrency,
		subscription.UserSub,
	)
}
