package logic

import (
	"context"

	"github.com/gogf/gf/v2/encoding/gjson"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/os/gcache"
	"github.com/gogf/gf/v2/util/gconv"

	v1 "github.com/shichen437/stellardex/api/v1/settings"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/settings/consts"
	"github.com/shichen437/stellardex/internal/app/settings/dao"
	"github.com/shichen437/stellardex/internal/app/settings/model"
	"github.com/shichen437/stellardex/internal/app/settings/model/do"
	"github.com/shichen437/stellardex/internal/app/settings/service"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

type (
	sUserSettings struct{}
)

func init() {
	service.RegisterUserSettings(New())
}

func New() service.IUserSettings {
	return &sUserSettings{}
}

func (s *sUserSettings) Get(ctx context.Context, req *v1.GetSettingsReq) (res *v1.GetSettingsRes, err error) {
	res = &v1.GetSettingsRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		res.UserSettings = saveDefaultSettings(ctx, 0)
		return
	}
	settings, err := dao.UserSettings.Ctx(ctx).Where(dao.UserSettings.Columns().UserId, uid).One()
	if err != nil {
		err = gerror.New("get user settings failed")
		return
	}
	if settings == nil {
		defaultSettings := saveDefaultSettings(ctx, uid)
		res.UserSettings = defaultSettings
		return
	}
	var userSettings model.UserSettings
	userSettings.Id = settings["id"].Int()
	userSettings.UserID = settings["user_id"].Int()

	if err := gjson.DecodeTo(settings["group_config"].String(), &userSettings.GroupConfig); err != nil {
		userSettings.GroupConfig = model.GroupConfig{}
	}
	if err := gjson.DecodeTo(settings["interface_config"].String(), &userSettings.InterfaceConfig); err != nil {
		userSettings.InterfaceConfig = model.InterfaceConfig{}
	}
	if err := gjson.DecodeTo(settings["module_config"].String(), &userSettings.ModuleConfig); err != nil {
		userSettings.ModuleConfig = model.ModuleConfig{}
	}
	if err := gjson.DecodeTo(settings["site_config"].String(), &userSettings.SiteConfig); err != nil {
		userSettings.SiteConfig = model.SiteConfig{}
	}

	gcache.Set(ctx, consts.CacheKeyPrefix+gconv.String(uid), userSettings, 0)
	res.UserSettings = &userSettings
	return
}

func (s *sUserSettings) Update(ctx context.Context, req *v1.PutSettingsReq) (res *v1.PutSettingsRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("user id is empty")
		return
	}
	if req.Id == 0 {
		err = gerror.New("settings id is empty")
		return
	}
	var settings *do.UserSettings
	dao.UserSettings.Ctx(ctx).WherePri(req.Id).Scan(&settings)
	if settings == nil || gconv.Int(settings.UserId) != uid {
		err = gerror.New("settings not found")
		return
	}
	_, err = dao.UserSettings.Ctx(ctx).WherePri(req.Id).Update(do.UserSettings{
		GroupConfig:     gjson.MustEncodeString(req.GroupConfig),
		InterfaceConfig: gjson.MustEncodeString(req.InterfaceConfig),
		ModuleConfig:    gjson.MustEncodeString(req.ModuleConfig),
		SiteConfig:      gjson.MustEncodeString(req.SiteConfig),
		UpdateAt:        utils.Now(),
	})
	if err != nil {
		err = gerror.New("update settings failed")
		return
	}
	gcache.Set(ctx, consts.CacheKeyPrefix+gconv.String(uid), req, 0)
	return
}

func saveDefaultSettings(ctx context.Context, userId int) *model.UserSettings {
	var engine string
	if utils.LANG == "zh-CN" {
		engine = consts.DefaultChineseEngine
	} else {
		engine = consts.DefaultOtherEngine
	}
	defaultSettings := &model.UserSettings{
		UserID: userId,
		GroupConfig: model.GroupConfig{
			GroupLayout: consts.DefaultLayout,
		},
		InterfaceConfig: model.InterfaceConfig{
			Language:      utils.LANG,
			InterfaceMode: consts.DefaultMode,
			ThemeMode:     consts.DefaultTheme,
		},

		ModuleConfig: model.ModuleConfig{
			ShowMeteors:    true,
			ShowSearchBar:  true,
			SearchEngine:   engine,
			ShowClock:      true,
			ShowCalendar:   true,
			CalendarFormat: consts.DefaultDateFormat,
		},
		SiteConfig: model.SiteConfig{
			SiteTitle:  consts.DefaultSiteTitle,
			SiteFooter: consts.DefaultSiteFooter,
		},
	}
	if userId == 0 {
		return defaultSettings
	}
	record, _ := dao.UserSettings.Ctx(ctx).Insert(do.UserSettings{
		UserId:          defaultSettings.UserID,
		GroupConfig:     gjson.MustEncodeString(defaultSettings.GroupConfig),
		InterfaceConfig: gjson.MustEncodeString(defaultSettings.InterfaceConfig),
		ModuleConfig:    gjson.MustEncodeString(defaultSettings.ModuleConfig),
		SiteConfig:      gjson.MustEncodeString(defaultSettings.SiteConfig),
		CreateAt:        utils.Now(),
	})
	if record != nil {
		id, err := record.LastInsertId()
		if err != nil {
			defaultSettings.Id = 0
		}
		defaultSettings.Id = gconv.Int(id)
	}
	return defaultSettings
}
