package bmparser

import (
	"context"
	"net/url"

	"github.com/gogf/gf/v2/util/gconv"
	"github.com/shichen437/stellardex/internal/app/bookmark/dao"
	"github.com/shichen437/stellardex/internal/app/bookmark/model/entity"
	"github.com/shichen437/stellardex/internal/pkg/bookmark"
)

type CustomParser struct {
	BaseParser
}

func NewCustomParser() *CustomParser {
	return &CustomParser{}
}

func (p *CustomParser) Parse(ctx context.Context, model *ArticleModel) (*ArticleModel, bool) {
	pUrl, err := url.Parse(model.Url)
	if err != nil || pUrl.Host == "" {
		return model, false
	}
	var selector *entity.UserCustomSelector
	dao.UserCustomSelector.Ctx(ctx).Where(dao.UserCustomSelector.Columns().UserId, model.UserId).
		Where(dao.UserCustomSelector.Columns().Domain, pUrl.Scheme+"://"+pUrl.Host).Scan(&selector)
	if selector == nil {
		return &ArticleModel{}, false
	}
	if selector.Cookie != "" {
		model.Cookie = selector.Cookie
	}
	if selector.Title != "" && selector.Content != "" {
		var config bookmark.ScraperConfig
		gconv.Struct(selector, &config.Selectors)
		config.URL = model.Url
		config.Cookie = model.Cookie
		scraper := bookmark.NewScraper(config)
		results, err := scraper.Scrape()
		if err != nil {
			return &ArticleModel{}, false
		}
		gconv.Struct(results, &model.ArticleData)
		if model.ArticleData.Content != "" && model.ArticleData.Title != "" {
			return model, true
		}
	}
	return &ArticleModel{}, false
}

func (p *CustomParser) SetNext(next BookmarkParser) {
	p.next = next
}

func (p *CustomParser) GetNext() BookmarkParser {
	return p.next
}
