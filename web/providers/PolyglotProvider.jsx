"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import Polyglot from 'node-polyglot';
import locales from '@/i18n';
import { useSettingsStore } from '@/lib/store/settings';

const PolyglotContext = createContext({
  t: (key, options) => key,
  lang: 'zh-CN',
  setLanguage: (newLang) => {
    setLang(newLang);
  },
});

export const PolyglotProvider = ({ children }) => {
  // 通过 zustand 获取当前语言
  const language = useSettingsStore(state => state.settings?.interfaceConfig?.language || 'zh-CN');
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