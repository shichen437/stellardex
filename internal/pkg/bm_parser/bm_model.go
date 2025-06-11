package bmparser

import (
	"time"
)

type ArticleModel struct {
	Url         string      `json:"url"`
	UserId      int         `json:"user_id"`
	Cookie      string      `json:"cookie"`
	ArticleData ArticleData `json:"article_data"`
}

type ArticleData struct {
	Title         string     `json:"title"`
	Byline        string     `json:"byline"`
	Excerpt       string     `json:"excerpt"`
	Content       string     `json:"content"`
	TextContent   string     `json:"text_content"`
	Favicon       string     `json:"favicon"`
	Image         string     `json:"image"`
	Language      string     `json:"language"`
	Length        int        `json:"length"`
	SiteName      string     `json:"site_name"`
	PublishedTime *time.Time `json:"published_time"`
	ModifiedTime  *time.Time `json:"modified_time"`
	ReadingTime   int        `json:"reading_time"`
	CoverImageUrl string     `json:"cover_image_url"`
}
