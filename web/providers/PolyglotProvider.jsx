"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import Polyglot from 'node-polyglot';
import en from '../i18n/en/en.json';
import zhCN from '../i18n/zh-CN/zh-CN.json';
import { useSettingsStore } from '@/lib/store/settings';

const locales = {
  'en': en,
  'zh-CN': zhCN,
};

const PolyglotContext = createContext({
  t: (key, options) => key,
  lang: 'en',
  setLanguage: () => {},
});

export const PolyglotProvider = ({ children }) => {
  // 通过 zustand 获取当前语言
  const language = useSettingsStore(state => state.settings?.interfaceConfig?.language || 'en');
  const [lang, setLang] = useState(language);

  useEffect(() => {
    setLang(language);
  }, [language]);

  const polyglot = useMemo(() => new Polyglot({
    phrases: locales[lang],
    locale: lang,
  }), [lang]);

  const setLanguage = (newLang) => {
    if (locales[newLang]) {
      setLang(newLang);
      // 这里不直接修改 settings，settings 应通过业务逻辑统一修改
    }
  };

  const t = (key, options) => polyglot.t(key, options);

  return (
    <PolyglotContext.Provider value={{ t, lang, setLanguage }}>
      {children}
    </PolyglotContext.Provider>
  );
};

export const usePolyglot = () => useContext(PolyglotContext);