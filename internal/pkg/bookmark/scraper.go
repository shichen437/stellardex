package bookmark

import (
	"context"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/gclient"
)

type SelectorConfig struct {
	Selector string `json:"selector"`
	Attr     string `json:"attr,omitempty"`
}

type ScraperConfig struct {
	URL       string                 `json:"url"`
	Selectors map[string]interface{} `json:"selectors"`
	Cookie    string                 `json:"cookie,omitempty"`
}

type Scraper struct {
	config ScraperConfig
}

func NewScraper(config ScraperConfig) *Scraper {
	return &Scraper{
		config: config,
	}
}

func (s *Scraper) Scrape() (map[string]string, error) {
	ctx := context.Background()
	client := gclient.New()

	client.SetAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
	client.SetHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
	client.SetHeader("cookie", s.config.Cookie)
	client.SetRetry(3, time.Second*2)

	resp, err := client.Get(ctx, s.config.URL)
	g.Log().Debugf(ctx, "%v Response body: %s,", s.config.URL, resp.Body)
	if err != nil {
		g.Log().Errorf(ctx, "%v Response body: %s,", s.config.URL, err.Error())
		return nil, gerror.Wrap(err, "request failed")
	}
	defer resp.Close()

	if resp.StatusCode != 200 {
		return nil, gerror.Newf("unexpected status code: %d", resp.StatusCode)
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, err
	}

	results := make(map[string]string)

	for name, selectorInterface := range s.config.Selectors {
		switch selector := selectorInterface.(type) {
		case string:
			selection := doc.Find(selector)
			if name == "excerpt" {
				if content, exists := selection.Attr("content"); exists {
					results[name] = content
				}
			} else if name == "content" {
				if html, err := selection.Html(); err == nil {
					results[name] = html
					results["textContent"] = selection.Text()
				}
			} else {
				results[name] = selection.Text()
			}
		case map[string]interface{}:
			if selectorStr, ok := selector["selector"].(string); ok {
				selection := doc.Find(selectorStr)
				if attrStr, ok := selector["attr"].(string); ok {
					if attr, exists := selection.Attr(attrStr); exists {
						results[name] = attr
					}
				}
			}
		}
	}

	return results, nil
}
