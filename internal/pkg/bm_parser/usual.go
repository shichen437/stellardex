package bmparser

import (
	"context"
	"net/http"
	"time"

	"github.com/go-shiori/go-readability"
	"github.com/gogf/gf/v2/util/gconv"
)

type UsualParser struct {
	BaseParser
}

func NewUsualParser() *UsualParser {
	return &UsualParser{}
}

func (p *UsualParser) Parse(ctx context.Context, model *ArticleModel) (*ArticleModel, bool) {
	timeout := time.Duration(10) * time.Second
	article, err := readability.FromURL(model.Url, timeout, func(r *http.Request) {
		r.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")
		r.Header.Set("Cookie", model.Cookie)
	})
	if err != nil || article.TextContent == "" || article.Title == "" {
		return &ArticleModel{}, false
	}
	gconv.Struct(article, &model.ArticleData)
	return model, true
}

func (p *UsualParser) SetNext(next BookmarkParser) {
	p.next = next
}

func (p *UsualParser) GetNext() BookmarkParser {
	return p.next
}
