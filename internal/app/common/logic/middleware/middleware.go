package middleware

import (
	"net/http"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/net/ghttp"

	"github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/common/model"
	"github.com/shichen437/stellardex/internal/app/common/service"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sMiddleware struct{}
)
type NewHandlerResponse struct {
	Code int         `json:"code"    dc:"Error code"`
	Msg  string      `json:"msg" dc:"Error msg"`
	Data interface{} `json:"data"    dc:"Result data for certain request according API definition"`
}

func init() {
	service.RegisterMiddleware(New())
}

func New() service.IMiddleware {
	return &sMiddleware{}
}

func (s *sMiddleware) Ctx(r *ghttp.Request) {
	customCtx := &model.Context{
		Session: r.Session,
	}
	service.BizCtx().Init(r, customCtx)
	if user := service.Session().GetUser(r.Context()); user != nil {
		customCtx.User = &model.ContextUser{
			Id:       user.Id,
			Nickname: user.Username,
		}
	}
	r.Middleware.Next()
}

func (s *sMiddleware) Auth(r *ghttp.Request) {
	r.Middleware.Next()
}

func (s *sMiddleware) CORS(r *ghttp.Request) {
	r.Response.CORSDefault()
	r.Middleware.Next()
}

func (s *sMiddleware) HandlerResponse(r *ghttp.Request) {
	r.Middleware.Next()

	if r.Response.BufferLength() > 0 {
		return
	}

	var (
		msg  string
		err  = r.GetError()
		res  = r.GetHandlerResponse()
		code = gerror.Code(err)
	)
	if err != nil {
		if code == gcode.CodeNil {
			code = gcode.CodeInternalError
		}
		if len(err.Error()) >= 60 {
			msg = err.Error()
		} else {
			msg = utils.T(r.Context(), err.Error())
		}
	} else {
		if r.Response.Status > 0 && r.Response.Status/100 != 2 {
			msg = http.StatusText(r.Response.Status)
			switch r.Response.Status {
			case http.StatusNotFound:
				code = gcode.CodeNotFound
			case http.StatusForbidden:
				code = gcode.CodeNotAuthorized
			default:
				code = gcode.CodeUnknown
			}
			err = gerror.NewCode(code, msg)
			r.SetError(err)
		} else {
			code = gcode.CodeOK
			msg = consts.Success
		}
	}

	r.Response.WriteJson(NewHandlerResponse{
		Code: code.Code(),
		Msg:  msg,
		Data: res,
	})
}
