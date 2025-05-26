package system

import (
	"context"
	"os"
	"path/filepath"
	"time"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gfile"
	"github.com/shichen437/stellardex/internal/app/group/dao"
	"github.com/shichen437/stellardex/internal/pkg/consts"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

func CleanIcon(ctx context.Context) {
	g.Log().Info(ctx, "Clean unused icons start!")

	basepath, err := filepath.Abs(utils.ICONS_PATH)
	if err != nil {
		g.Log().Error(ctx, "Get icons path failed: ", err)
		return
	}

	existsMap := getAllIconUrl(ctx)
	if len(existsMap) == 0 {
		g.Log().Info(ctx, "No icon used, skip clean!")
		return
	}

	now := time.Now()
	files, err := gfile.ScanDir(basepath, "*", false)
	if err != nil {
		g.Log().Error(ctx, "Scan icon dir failed: ", err)
		return
	}
	for _, file := range files {
		fileInfo, err := os.Stat(file)
		if err != nil {
			continue
		}
		if now.Sub(fileInfo.ModTime()) < consts.USUSED_FILE_TIME {
			continue
		}
		saveName := "/icons/" + fileInfo.Name()
		if existsMap[saveName] {
			continue
		}
		err = gfile.Remove(file)
		if err != nil {
			g.Log().Error(ctx, "Remove icon failed: ", err)
		}
	}
	g.Log().Info(ctx, "Clean unused icons finished!")
}

func getAllIconUrl(ctx context.Context) (iconMap map[string]bool) {
	iconMap = make(map[string]bool)
	pageNum := 1

	for {
		var queryUrl []string
		err := dao.UserGroupItem.Ctx(ctx).
			Fields(dao.UserGroupItem.Columns().IconUrl).
			WhereLike(dao.UserGroupItem.Columns().IconUrl, "/icons/%").
			Page(pageNum, consts.DB_BATCH_SIZE).
			Scan(&queryUrl)
		if err != nil {
			g.Log().Error(ctx, "Get group items failed: ", err)
			return
		}
		if len(queryUrl) == 0 {
			break
		}
		for _, url := range queryUrl {
			iconMap[url] = true
		}
		pageNum++
	}
	g.Log().Info(ctx, "Total icon URLs loaded:", len(iconMap))
	return iconMap
}
