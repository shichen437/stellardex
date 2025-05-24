package system

import (
	"context"
	"os"
	"path/filepath"
	"time"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gfile"
	"github.com/shichen437/stellardex/internal/app/group/dao"
	"github.com/shichen437/stellardex/internal/pkg/utils"
)

func CleanIcon(ctx context.Context) {
	g.Log().Info(ctx, "Clean unused icons start!")

	basepath, err := filepath.Abs(utils.ICONS_PATH)
	if err != nil {
		return
	}

	batchSize := 100
	processed := 0

	_, err = gfile.ScanDirFunc(basepath, "*", false, func(path string) string {
		if processed >= batchSize {
			return ""
		}

		fileInfo, statErr := os.Stat(path)
		if statErr != nil {
			return ""
		}

		if time.Since(fileInfo.ModTime()) < 24*time.Hour {
			return ""
		}

		saveName := "/icons/" + fileInfo.Name()
		num, checkErr := dao.UserGroupItem.Ctx(ctx).Where(dao.UserGroupItem.Columns().IconUrl, saveName).Count()
		if checkErr != nil || num > 0 {
			return ""
		}

		err = gfile.Remove(path)
		if err != nil {
			g.Log().Error(ctx, "Remove icon failed: ", err)
		}

		processed++
		return path
	})

	if err != nil {
		g.Log().Error(ctx, "Scan icon dir failed: ", err)
	}

	g.Log().Info(ctx, "Clean unused icons finished!")
}
