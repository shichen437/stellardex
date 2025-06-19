package bmparser

import (
	"context"
	"encoding/json"
	"os"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/util/gconv"
	"github.com/shichen437/stellardex/internal/pkg/bookmark"
)

type RuleParser struct {
	BaseParser
}

func NewRuleParser() *RuleParser {
	return &RuleParser{}
}

func (p *RuleParser) Parse(ctx context.Context, model *ArticleModel) (*ArticleModel, bool) {
	site := bookmark.DealSiteName(model.Url)
	dir, err := os.Getwd()
	if err != nil || dir == "" {
		return &ArticleModel{}, false
	}
	file, err := os.ReadFile(dir + "/internal/pkg/rules/" + site + ".json")
	if file == nil || err != nil {
		return &ArticleModel{}, false
	}
	var config bookmark.ScraperConfig
	if err = json.Unmarshal(file, &config); err != nil {
		return &ArticleModel{}, false
	}
	config.URL = model.Url
	config.Cookie = model.Cookie
	if model.IoReader != nil {
		config.Reader = model.IoReader
	}
	scraper := bookmark.NewScraper(config)
	results, err := scraper.Scrape()
	g.Log().Debugf(ctx, "Scrape results: %v", results)
	if err != nil {
		g.Log().Errorf(ctx, "Scrape error: %v", err)
		return &ArticleModel{}, false
	}
	gconv.Struct(results, &model.ArticleData)
	return model, true
}

func (p *RuleParser) SetNext(next BookmarkParser) {
	p.next = next
}

func (p *RuleParser) GetNext() BookmarkParser {
	return p.next
}
