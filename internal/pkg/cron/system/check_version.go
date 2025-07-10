package system

import (
	"context"
	"time"

	"github.com/gogf/gf/v2/encoding/gjson"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gcache"
	"github.com/shichen437/stellardex/internal/pkg/consts"
)

func CheckVersion(ctx context.Context) string {
	ch := make(chan string, 2)
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	go fetchGithubVersion(ctx, ch)
	go fetchGiteeVersion(ctx, ch)

	select {
	case tag := <-ch:
		if tag != "" {
			_ = gcache.Set(ctx, consts.VersionKey, tag, 0)
			cancel()
			return tag
		}
		select {
		case tag2 := <-ch:
			if tag2 != "" {
				_ = gcache.Set(ctx, consts.VersionKey, tag2, 0)
				cancel()
				return tag2
			}
		case <-ctx.Done():
		}
	case <-ctx.Done():
	}
	_ = gcache.Set(ctx, consts.VersionKey, "", 0)
	return ""
}

func GetLatestVersion(ctx context.Context, forceRefresh bool) string {
	versionVar, err := gcache.Get(ctx, consts.VersionKey)
	if err != nil {
		return ""
	}
	if !versionVar.IsNil() {
		return versionVar.String()
	}
	if forceRefresh {
		return CheckVersion(ctx)
	}
	return ""
}

func fetchGithubVersion(ctx context.Context, ch chan<- string) {
	client := g.Client()
	client.SetTimeout(4 * time.Second)
	client.SetHeader("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1")
	resp, err := client.Get(ctx, "https://api.github.com/repos/"+consts.Repository+"/releases/latest")
	if err != nil || resp.StatusCode != 200 {
		ch <- ""
		return
	}
	defer resp.Close()
	body := resp.ReadAllString()
	version := gjson.New(body).Get("tag_name").String()
	ch <- version
}

func fetchGiteeVersion(ctx context.Context, ch chan<- string) {
	client := g.Client()
	client.SetTimeout(4 * time.Second)
	client.SetHeader("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1")
	resp, err := client.Get(ctx, "https://gitee.com/api/v5/repos/"+consts.Repository+"/releases/latest")
	if err != nil || resp.StatusCode != 200 {
		ch <- ""
		return
	}
	defer resp.Close()
	body := resp.ReadAllString()
	version := gjson.New(body).Get("tag_name").String()
	ch <- version
}
