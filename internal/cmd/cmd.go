package cmd

import (
	"context"
	"fmt"

	"github.com/goflyfox/gtoken/gtoken"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gcmd"
	"github.com/gogf/gf/v2/util/gconv"

	"github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/common/service"
	userGroup "github.com/shichen437/stellardex/internal/app/group/controller"
	settings "github.com/shichen437/stellardex/internal/app/settings/controller"
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
			s := g.Server()
			s.SetGraceful(true)
			s.SetIndexFolder(true)
			s.SetSwaggerUITemplate(consts.MySwaggerUITemplate)
			s.Use(service.Middleware().HandlerResponse)
			s.BindHandler("/sse", sse.HandleSSE)
			s.Group("/", func(group *ghttp.RouterGroup) {
				group.Middleware(
					service.Middleware().Ctx,
					ghttp.MiddlewareCORS,
				)
				group.Group("/", func(group *ghttp.RouterGroup) {
					err = gfToken.Middleware(ctx, group)
					if err != nil {
						panic(err)
					}
					bindRoute(group)
				})
			})
			s.Run()
			return nil
		},
	}
)

func GetGtoken(ctx context.Context) (gfToken *gtoken.GfToken, err error) {
	gfToken = &gtoken.GfToken{
		AuthAfterFunc:    AuthAfterFunc,
		AuthExcludePaths: g.SliceStr{"/logout"},
		AuthPaths:        g.SliceStr{"/*"},
		CacheMode:        3,
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
	username := r.Get("username").String()
	password := r.Get("password").String()
	if username == "" || password == "" {
		r.Response.WriteJson(gtoken.Fail("账号或密码不能为空"))
		r.ExitAll()
	}
	ctx := context.TODO()
	var users *entity.SysUser
	enc, _ := utils.Encrypt(ctx, password)
	err := dao.SysUser.Ctx(ctx).Where(do.SysUser{
		Username: username,
		Password: enc,
	}).Scan(&users)
	if err != nil || users == nil {
		r.Response.WriteJson(gtoken.Fail("账号或密码错误"))
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
		g.Log().Error(context.Background(), err)
		return
	}
	service.Session().SetUser(r.Context(), &users)
	r.SetCtxVar(consts.CtxAdminId, users.Id)
	r.SetCtxVar(consts.CtxAdminName, users.Username)
	r.Middleware.Next()
}

func bindRoute(group *ghttp.RouterGroup) {
	group.Bind(
		user.SysUser,
		user.SysRole,
		userGroup.UserGroup,
		userGroup.UserGroupItem,
		settings.UserSettings,
	)
}
