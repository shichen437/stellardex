package model

type SearchGroupItem struct {
	GroupId     int    `json:"groupId"`
	GroupName   string `json:"groupName"`
	Title       string `json:"title"`
	Url         string `json:"url"`
	LanUrl      string `json:"lanUrl"`
	Description string `json:"description"`
}
