package bookmark

import (
	"html"
	"math"
	"net/url"
	"regexp"
	"strings"
	"unicode"
)

var (
	EnglishWordsPerMinute = 240
	ChineseCharsPerMinute = 400

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

func CalcReadingTime(content string) int {
	chineseChars := 0
	englishWords := 0
	inWord := false

	for _, r := range content {
		if unicode.Is(unicode.Han, r) || isChinesePunctuation(r) {
			chineseChars++
			if inWord {
				englishWords++
				inWord = false
			}
		} else if unicode.IsLetter(r) {
			if !inWord {
				inWord = true
			}
		} else if inWord && (unicode.IsSpace(r) || unicode.IsPunct(r)) {
			englishWords++
			inWord = false
		}
	}
	if inWord {
		englishWords++
	}

	englishTime := math.Ceil(float64(englishWords) / float64(EnglishWordsPerMinute))
	chineseTime := math.Ceil(float64(chineseChars) / float64(ChineseCharsPerMinute))

	return max(1, int(englishTime+chineseTime))
}

func StripHTML(html_content string) string {
	noScript := regexp.MustCompile(`(?s)<script.*?</script>`).ReplaceAllString(html_content, "")
	noStyle := regexp.MustCompile(`(?s)<style.*?</style>`).ReplaceAllString(noScript, "")

	noTags := regexp.MustCompile(`<[^>]+>`).ReplaceAllString(noStyle, "")
	noEntities := html.UnescapeString(noTags)
	noExtraSpace := regexp.MustCompile(`\s+`).ReplaceAllString(noEntities, " ")

	return strings.TrimSpace(noExtraSpace)
}

func isChinesePunctuation(r rune) bool {
	return (r >= 0x3000 && r <= 0x303F) ||
		(r >= 0xFF00 && r <= 0xFFEF)
}
