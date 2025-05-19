package utils

import (
	"context"
	"sync"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/i18n/gi18n"
)

var (
	instance     *SingleI18n
	once         sync.Once
	assist_langs = map[string]string{
		"zh-CN": "zh-CN",
		"en":    "en",
	}
)

type SingleI18n struct {
	m *gi18n.Manager
}

func getInstance() *SingleI18n {
	once.Do(func() {
		instance = &SingleI18n{}
		i18n := g.I18n()
		i18n.SetPath("i18n")
		lang := LANG
		if lang == "" || assist_langs[lang] == "" {
			i18n.SetLanguage(`zh-CN`)
		} else {
			i18n.SetLanguage(lang)
		}
		instance.m = i18n
	})
	return instance
}

func T(ctx context.Context, key string) string {
	return getInstance().m.T(ctx, key)
}

func Tf(ctx context.Context, key string, format ...interface{}) string {
	return getInstance().m.Tf(ctx, key, format...)
}

func TError(ctx context.Context, key string) error {
	return gerror.New(T(ctx, key))
}

func TfError(ctx context.Context, key string, format ...interface{}) error {
	return gerror.New(Tf(ctx, key, format))
}
