package model

type UserSettings struct {
	Id              int             `json:"id"`
	UserID          int             `json:"userId"`
	GroupConfig     GroupConfig     `json:"groupConfig"`
	InterfaceConfig InterfaceConfig `json:"interfaceConfig"`
	ModuleConfig    ModuleConfig    `json:"moduleConfig"`
	SiteConfig      SiteConfig      `json:"siteConfig"`
}

type InterfaceConfig struct {
	Language       string `json:"language"`
	InterfaceMode  string `json:"interfaceMode"`
	ThemeMode      string `json:"themeMode"`
	BgImage        string `json:"bgImage"`
	BgImageBlurred int    `json:"bgImageBlurred"`
}

type ModuleConfig struct {
	ShowMeteors    bool   `json:"showMeteors"`
	ShowSearchBar  bool   `json:"showSearchBar"`
	ShowCalendar   bool   `json:"showCalendar"`
	ShowClock      bool   `json:"showClock"`
	ShowMonitor    bool   `json:"showMonitor"`
	CalendarFormat string `json:"calendarFormat"`
	SearchEngine   string `json:"searchEngine"`
	ShowBookmarks  bool   `json:"showBookmarks"`
}

type SiteConfig struct {
	SiteTitle  string `json:"siteTitle" description:"站点标题"`
	SiteFooter string `json:"siteFooter" description:"站点脚注"`
}

type GroupConfig struct {
	GroupLayout string `json:"groupLayout"`
}
