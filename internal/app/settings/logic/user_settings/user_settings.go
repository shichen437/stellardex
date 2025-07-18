package logic

import (
	"context"
	"time"

	"github.com/gogf/gf/v2/encoding/gjson"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/os/gcache"
	"github.com/gogf/gf/v2/util/gconv"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"

	v1 "github.com/shichen437/stellardex/api/v1/settings"
	commonConsts "github.com/shichen437/stellardex/internal/app/common/consts"
	"github.com/shichen437/stellardex/internal/app/settings/consts"
	"github.com/shichen437/stellardex/internal/app/settings/dao"
	"github.com/shichen437/stellardex/internal/app/settings/model"
	"github.com/shichen437/stellardex/internal/app/settings/model/do"
	"github.com/shichen437/stellardex/internal/app/settings/model/entity"
	"github.com/shichen437/stellardex/internal/app/settings/service"
	"github.com/shichen437/stellardex/internal/pkg/cron/system"
	monitorEntity "github.com/shichen437/stellardex/internal/pkg/monitor/entity"
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
		err = gerror.New("settings.error.Get")
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
		err = gerror.New("auth.UserIDEmpty")
		return
	}
	if req.Id == 0 {
		err = gerror.New("settings.valid.SettingsIDEmpty")
		return
	}
	var settings *do.UserSettings
	dao.UserSettings.Ctx(ctx).WherePri(req.Id).Scan(&settings)
	if settings == nil || gconv.Int(settings.UserId) != uid {
		err = gerror.New("settings.error.NotFound")
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
		err = gerror.New("settings.error.Update")
		return
	}
	gcache.Set(ctx, consts.CacheKeyPrefix+gconv.String(uid), req, 0)
	return
}

func (s *sUserSettings) GetDefaultLang(ctx context.Context, req *v1.GetDefaultLangReq) (res *v1.GetDefaultLangRes, err error) {
	res = &v1.GetDefaultLangRes{}
	lang := utils.LANG
	if lang == "" || consts.AllowLangMap[lang] == "" {
		lang = "zh-CN"
	}
	res.Lang = lang
	return
}

func (s *sUserSettings) BgImage(ctx context.Context, req *v1.PostBgImageReq) (res *v1.PostBgImageRes, err error) {
	res = &v1.PostBgImageRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("user.valid.UserIdEmpty")
		return
	}
	file := req.BgImage
	var format string
	if format = utils.GetFileFormat(file.Filename); format == "" {
		format = "jpeg"
	}
	file.Filename = "aaa." + format
	name, err := file.Save(utils.BG_IMAGE_PATH, true)
	if err != nil {
		err = gerror.New("file.uploadError")
		return
	}
	_, err = dao.UserImg.Ctx(ctx).Insert(do.UserImg{
		UserId:   uid,
		Url:      "/background/" + name,
		Type:     consts.UserImagTypeBg,
		CreateAt: utils.Now(),
	})
	if err != nil {
		err = gerror.New("data.AddFailed")
		return
	}
	res.ImageUrl = "/background/" + name
	return
}

func (s *sUserSettings) BgImageList(ctx context.Context, req *v1.GetBgImageListReq) (res *v1.GetBgImageListRes, err error) {
	res = &v1.GetBgImageListRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("user.valid.UserIdEmpty")
		return
	}
	var list []*entity.UserImg
	m := dao.UserImg.Ctx(ctx).
		Where(dao.UserImg.Columns().UserId, uid).
		Where(dao.UserImg.Columns().Type, consts.UserImagTypeBg).
		OrderDesc(dao.UserImg.Columns().Id)
	total, err := m.Count()
	if total > 0 && err == nil {
		err = m.Page(req.PageNum, req.PageSize).Scan(&list)
		if err != nil {
			err = gerror.New("data.ListFailed")
			return
		}
		res.Total = total
		res.Rows = list
	}
	return
}

func (s *sUserSettings) BgImageDelete(ctx context.Context, req *v1.DeleteBgImageReq) (res *v1.DeleteBgImageRes, err error) {
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		err = gerror.New("user.valid.UserIdEmpty")
		return
	}
	var img *entity.UserImg
	dao.UserImg.Ctx(ctx).
		Where(dao.UserImg.Columns().Id, req.Id).
		Where(dao.UserImg.Columns().UserId, uid).
		Where(dao.UserImg.Columns().Type, consts.UserImagTypeBg).
		Scan(&img)
	if img == nil {
		return
	}
	_, err = dao.UserImg.Ctx(ctx).WherePri(req.Id).Delete()
	if err != nil {
		err = gerror.New("data.DeleteFailed")
		return
	}
	utils.RemoveFile(img.Url)
	return
}

func (s *sUserSettings) CheckVersion(ctx context.Context, req *v1.CheckVersionReq) (res *v1.CheckVersionRes, err error) {
	res = &v1.CheckVersionRes{}
	uid := gconv.Int(ctx.Value(commonConsts.CtxAdminId))
	if uid == 0 {
		return
	}
	res.LatestVerison = system.GetLatestVersion(ctx, true)
	return
}

func (c *sUserSettings) Monitor(ctx context.Context, req *v1.GetMonitorInfoReq) (res *v1.GetMonitorInfoRes, err error) {
	res = &v1.GetMonitorInfoRes{}
	cpuInfo, _ := cpu.Info()
	percents, _ := cpu.Percent(100*time.Millisecond, false)
	var cpuData *monitorEntity.CpuInfo
	if len(cpuInfo) > 0 {
		gconv.Struct(cpuInfo[0], &cpuData)
		if len(percents) > 0 {
			cpuData.Percent = percents[0]
		}
	}
	var memData *monitorEntity.MemoryInfo
	memInfo, _ := mem.VirtualMemory()
	if memInfo != nil {
		gconv.Struct(memInfo, &memData)
	}
	var diskData *monitorEntity.DiskInfo
	diskInfo, _ := disk.Usage("/")
	if diskInfo != nil {
		gconv.Struct(diskInfo, &diskData)
	}
	res.Cpu = cpuData
	res.Mem = memData
	res.Disk = diskData
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
