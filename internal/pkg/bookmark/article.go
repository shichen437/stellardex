package bookmark

import (
	"html"
	"math"
	"net/url"
	"regexp"
	"strings"
)

var (
	WordsPerMinute = 320

	secondLevelTLDs = []string{
		"com", "net", "org", "edu", "gov",
	}
)

func DealTitle(title string) string {
	if len(title) > 100 {
		title = title[:100] + "..."
	}
	return title
}

func DealExcerpt(excerpt string) string {
	if len(excerpt) > 255 {
		excerpt = excerpt[:255] + "..."
	}
	return excerpt
}

func DealSiteName(sourceUrl string) string {
	link, err := url.Parse(sourceUrl)
	if err != nil {
		return ""
	}

	host := link.Host

	if strings.Contains(host, ":") {
		host = strings.Split(host, ":")[0]
	}

	host = strings.TrimPrefix(host, "www.")

	if idx := strings.LastIndex(host, "."); idx > 0 {
		host = host[:idx]
		for _, tld := range secondLevelTLDs {
			suffix := "." + tld
			if strings.HasSuffix(host, suffix) {
				host = host[:len(host)-len(suffix)]
				break
			}
		}
	}

	return host
}

func CalcReadingTime(wordCount int) int {
	return int(math.Ceil(float64(wordCount) / float64(WordsPerMinute)))
}

func StripHTML(html_content string) string {
	noScript := regexp.MustCompile(`(?s)<script.*?</script>`).ReplaceAllString(html_content, "")
	noStyle := regexp.MustCompile(`(?s)<style.*?</style>`).ReplaceAllString(noScript, "")

	noTags := regexp.MustCompile(`<[^>]+>`).ReplaceAllString(noStyle, "")
	noEntities := html.UnescapeString(noTags)
	noExtraSpace := regexp.MustCompile(`\s+`).ReplaceAllString(noEntities, " ")

	return strings.TrimSpace(noExtraSpace)
}
