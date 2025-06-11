package bmparser

import (
	"context"
)

type BookmarkParser interface {
	Parse(ctx context.Context, model *ArticleModel) (*ArticleModel, bool)
	SetNext(next BookmarkParser)
	GetNext() BookmarkParser
}

type BaseParser struct {
	next BookmarkParser
}

func (b *BaseParser) GetNext() BookmarkParser {
	return b.next
}

func (b *BaseParser) SetNext(next BookmarkParser) {
	b.next = next
}

func createParserChain(parsers ...BookmarkParser) BookmarkParser {
	if len(parsers) == 0 {
		return nil
	}

	head := parsers[0]
	current := head

	for _, parser := range parsers[1:] {
		current.SetNext(parser)
		current = parser
	}

	return head
}

func ParseBookmark(ctx context.Context, model ArticleModel) (ArticleData, bool) {
	if model.Url == "" || model.UserId == 0 {
		return ArticleData{}, false
	}

	parsers := []BookmarkParser{
		NewCustomParser(),
		NewRuleParser(),
		NewUsualParser(),
	}

	chain := createParserChain(parsers...)
	if chain == nil {
		return ArticleData{}, false
	}
	currentParser := chain
	for currentParser != nil {
		model, ok := currentParser.Parse(ctx, &model)
		if ok {
			return PostProcessor(ctx, model)
		}
		currentParser = currentParser.GetNext()
	}

	return ArticleData{}, false
}
