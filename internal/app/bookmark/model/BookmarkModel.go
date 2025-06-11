package model

type BookmarkModel struct {
	Id            int    `json:"id"`
	Title         string `json:"title"`
	Excerpt       string `json:"excerpt"`
	Author        string `json:"author"`
	SiteName      string `json:"siteName"`
	SourceUrl     string `json:"sourceUrl"`
	ReadingTime   int    `json:"readingTime"`
	CoverImageUrl string `json:"coverImageUrl"`
	Status        int    `json:"status"`
	IsArchive     int    `json:"isArchive"`
	IsStarred     int    `json:"isStarred"`
}
