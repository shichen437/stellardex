package bmparser

import (
	"context"

	"github.com/shichen437/stellardex/internal/pkg/bookmark"
)

func PostProcessor(ctx context.Context, model *ArticleModel) (ArticleData, bool) {
	result := model.ArticleData
	if result == (ArticleData{}) || result.Content == "" || result.Title == "" {
		return ArticleData{}, false
	}
	if result.TextContent == "" && result.Content != "" {
		result.TextContent = bookmark.StripHTML(result.Content)
	}
	if result.Length > 0 && result.ReadingTime <= 0 {
		result.ReadingTime = bookmark.CalcReadingTime(result.Length)
	}
	if len(result.TextContent) > 0 && result.Length == 0 {
		result.Length = len(result.TextContent)
		result.ReadingTime = bookmark.CalcReadingTime(result.Length)
	}
	result.Byline = bookmark.DealTitle(result.Byline)
	result.Title = bookmark.DealTitle(result.Title)
	result.SiteName = bookmark.DealSiteName(model.Url)
	replaceHtml, mainImage := bookmark.ReplaceImagesInHTML(ctx, result.Content, model.Url, model.UserId)
	result.Content = replaceHtml
	result.CoverImageUrl = mainImage
	return result, true
}
