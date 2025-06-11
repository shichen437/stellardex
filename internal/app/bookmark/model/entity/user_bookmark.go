// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// UserBookmark is the golang structure for table user_bookmark.
type UserBookmark struct {
	Id            int         `json:"id"            orm:"id"              description:""`
	UserId        int         `json:"userId"        orm:"user_id"         description:""`
	Author        string      `json:"author"        orm:"author"          description:""`
	ContentHtml   string      `json:"contentHtml"   orm:"content_html"    description:""`
	Excerpt       string      `json:"excerpt"       orm:"excerpt"         description:""`
	PublishedAt   *gtime.Time `json:"publishedAt"   orm:"published_at"    description:""`
	ReadingTime   int         `json:"readingTime"   orm:"reading_time"    description:""`
	SourceUrl     string      `json:"sourceUrl"     orm:"source_url"      description:""`
	Title         string      `json:"title"         orm:"title"           description:""`
	WordCount     int         `json:"wordCount"     orm:"word_count"      description:""`
	ContentText   string      `json:"contentText"   orm:"content_text"    description:""`
	CoverImageUrl string      `json:"coverImageUrl" orm:"cover_image_url" description:""`
	SiteName      string      `json:"siteName"      orm:"site_name"       description:""`
	Status        int         `json:"status"        orm:"status"          description:""`
	IsArchive     int         `json:"isArchive"     orm:"is_archive"      description:""`
	IsStarred     int         `json:"isStarred"     orm:"is_starred"      description:""`
	CreateAt      *gtime.Time `json:"createAt"      orm:"create_at"       description:""`
	UpdateAt      *gtime.Time `json:"updateAt"      orm:"update_at"       description:""`
}
