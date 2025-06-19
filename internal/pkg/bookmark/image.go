package bookmark

import (
	"context"
	"crypto/md5"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/PuerkitoBio/goquery"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

var (
	removePrefix = "resource/data/upload"
)

func QuickSaveImg(ctx context.Context, imgUrl, originUrl string, uid int) string {
	if imgUrl == "" {
		return imgUrl
	}

	baseDir := utils.BM_IMAGE_PATH
	if err := os.MkdirAll(baseDir, os.ModePerm); err != nil {
		return ""
	}

	salts := utils.IntToBytes(uid)
	if salts == nil {
		return ""
	}

	h := md5.New()
	io.WriteString(h, originUrl)
	dirName := fmt.Sprintf("%x", h.Sum(salts))
	saveDir := filepath.Join(baseDir, dirName)
	if err := os.MkdirAll(saveDir, os.ModePerm); err != nil {
		return ""
	}

	imgHash := md5.New()
	io.WriteString(imgHash, imgUrl)
	cleanUrl := strings.SplitN(imgUrl, "?", 2)[0]
	ext := filepath.Ext(cleanUrl)
	if ext == "" {
		ext = ".jpg"
	}
	filename := fmt.Sprintf("%x%s", imgHash.Sum(nil), ext)
	savePath := filepath.Join(saveDir, filename)

	if _, err := os.Stat(savePath); err == nil {
		return removeCommonPrefix(savePath)
	}

	client := g.Client()
	client.SetHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")
	client.SetHeader("Referer", originUrl)
	client.SetHeader("Accept", "*/*")
	client.SetHeader("Accept-Encoding", "gzip, deflate, br")
	resp, err := client.Get(ctx, imgUrl)
	if err != nil {
		return ""
	}
	if resp.StatusCode != 200 {
		return ""
	}

	f, err := os.Create(savePath)
	if err != nil {
		return ""
	}
	defer f.Close()

	if _, err = io.Copy(f, resp.Body); err != nil {
		os.Remove(savePath)
		return ""
	}

	return removeCommonPrefix(savePath)
}

func ClearInvalidImages(ctx context.Context, originUrl string, uid int) {
	baseDir := utils.BM_IMAGE_PATH
	h := md5.New()
	io.WriteString(h, originUrl)
	salts := utils.IntToBytes(uid)
	if salts == nil {
		return
	}
	dirName := fmt.Sprintf("%x", h.Sum(salts))
	saveDir := filepath.Join(baseDir, dirName)
	os.RemoveAll(saveDir)
}

func ReplaceImagesInHTML(ctx context.Context, content string, originUrl string, uid int) (string, string) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(content))
	if err != nil {
		return content, ""
	}

	sem := make(chan struct{}, 10)
	var wg sync.WaitGroup

	type imageReplace struct {
		selection *goquery.Selection
		src       string
	}
	var images []imageReplace

	doc.Find("img").Each(func(i int, s *goquery.Selection) {
		if src, exists := s.Attr("src"); exists {
			if strings.HasPrefix(src, "//") {
				src = "https:" + src
			}
			images = append(images, imageReplace{s, src})
		}
	})
	var mainImage string
	for i, img := range images {
		wg.Add(1)
		go func(s *goquery.Selection, src string) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			if newSrc := QuickSaveImg(ctx, src, originUrl, uid); newSrc != "" {
				s.SetAttr("src", newSrc)
				if mainImage == "" && i == 0 {
					mainImage = newSrc
				}
			}
			s.RemoveAttr("data-src")
		}(img.selection, img.src)
	}

	wg.Wait()

	html, err := doc.Html()
	if err != nil {
		return content, ""
	}
	return html, mainImage
}

func removeCommonPrefix(savePath string) string {
	parts := strings.Split(savePath, removePrefix)
	if len(parts) > 1 {
		return parts[1]
	}
	return savePath
}
