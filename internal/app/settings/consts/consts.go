package consts

import "github.com/gogf/gf/v2/frame/g"

const (
	CacheKeyPrefix = "user_settings_"

	DefaultMode          = "navigation"
	DefaultTheme         = "system"
	DefaultLayout        = "row"
	DefaultChineseEngine = "baidu"
	DefaultOtherEngine   = "google"
	DefaultDateFormat    = "YYYY-MM-DD"
	DefaultSiteTitle     = "StellarDex"
	DefaultSiteFooter    = "Copyright 2025 shichen437"

	UserImagTypeBg = "bg"
)

var AllowLangMap = g.Map{
	"zh-CN": "zh-CN",
	"en":    "en",
}
