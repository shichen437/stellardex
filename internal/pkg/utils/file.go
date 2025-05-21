package utils

import (
	"context"
	"os"
	"path/filepath"

	"github.com/gogf/gf/v2/frame/g"
)

func RemoveFile(filename string) {
	if filename == "" {
		return
	}
	base, err := filepath.Abs(UPLOAD_PATH)
	if err != nil {
		g.Log().Errorf(context.TODO(), "get base path failed: %v", err)
		return
	}
	err = os.RemoveAll(filepath.Join(base, filename))
	if err != nil {
		g.Log().Errorf(context.TODO(), "remove file %s failed: %v", filename, err)
	}
}
