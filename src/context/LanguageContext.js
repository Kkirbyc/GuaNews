import React, { createContext, useContext, useMemo, useState } from 'react';

export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_STORAGE_KEY = 'guanews.lang';

export const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'zh', label: '中文', name: 'Chinese' },
  { code: 'ja', label: '日本語', name: 'Japanese' },
  { code: 'es', label: 'ES', name: 'Spanish' },
  { code: 'fr', label: 'FR', name: 'French' },
];

const languageCodes = new Set(languages.map(language => language.code));

const LanguageContext = createContext({
  lang: DEFAULT_LANGUAGE,
  setLang: () => {},
  languages,
});

function normalizeLanguage(value) {
  return languageCodes.has(value) ? value : DEFAULT_LANGUAGE;
}

function getStoredLanguage() {
  try {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch (err) {
    return DEFAULT_LANGUAGE;
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getStoredLanguage);

  const setLang = (nextLang) => {
    const normalizedLang = normalizeLanguage(nextLang);
    setLangState(normalizedLang);

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLang);
    } catch (err) {
      // Ignore storage errors so language switching still works in memory.
    }
  };

  const value = useMemo(() => ({ lang, setLang, languages }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

