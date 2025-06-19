package apiKey

import (
	"net/http"
	"strings"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gtime"

	"github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/common/service"
	"github.com/shichen437/stellardex/internal/app/user/dao"
	"github.com/shichen437/stellardex/internal/app/user/model/entity"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sApiKeyMiddleware struct{}
)

func init() {
	service.RegisterApiKeyMiddleware(New())
}

func New() service.IApiKeyMiddleware {
	return &sApiKeyMiddleware{}
}

func (s *sApiKeyMiddleware) ApiKeyMiddleware(r *ghttp.Request) {
	valid, err := validateApiKey(r)
	if err != nil {
		r.Response.WriteStatusExit(http.StatusInternalServerError, g.Map{
			"code": 500,
			"msg":  "Internal server error",
		})
	}

	if !valid {
		r.Response.WriteStatusExit(http.StatusUnauthorized, g.Map{
			"code": 401,
			"msg":  "Invalid API Key",
		})
	}

	r.Middleware.Next()
}

func validateApiKey(r *ghttp.Request) (bool, error) {
	ctx := r.Context()
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return false, nil
	}

	const bearerPrefix = "Bearer "
	if !strings.HasPrefix(authHeader, bearerPrefix) {
		return false, nil
	}
	apiKey := strings.TrimPrefix(authHeader, bearerPrefix)
	hash := utils.HashApiKey(apiKey)

	var apiKeyInfo *entity.SysApiKey
	err := dao.SysApiKey.Ctx(ctx).
		Where(dao.SysApiKey.Columns().ApiKey, hash).
		Where(dao.SysApiKey.Columns().Status, 1).
		Scan(&apiKeyInfo)
	if err != nil {
		return false, err
	}

	if apiKeyInfo == nil {
		return false, nil
	}
	if apiKeyInfo.ExpiresAt != nil && apiKeyInfo.ExpiresAt.Before(gtime.Now()) {
		if apiKeyInfo.Status == 1 {
			dao.SysApiKey.Ctx(ctx).
				Where(dao.SysApiKey.Columns().Id, apiKeyInfo.Id).
				Update(dao.SysApiKey.Columns().Status, 0)
		}
		return false, nil
	}
	r.SetCtxVar(consts.CtxAdminId, apiKeyInfo.UserId)
	return true, nil
}
