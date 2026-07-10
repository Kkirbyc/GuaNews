import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const LIBRARY_STORAGE_KEY = 'guanews.saved';

const LibraryContext = createContext({
  saved: [],
  isSaved: () => false,
  toggleSave: () => {},
  removeSaved: () => {},
});

function loadSaved() {
  try {
    const raw = window.localStorage.getItem(LIBRARY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function LibraryProvider({ children }) {
  const [saved, setSaved] = useState(loadSaved);

  useEffect(() => {
    try {
      window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(saved));
    } catch (err) {
      // Ignore storage errors so saving still works in-memory this session.
    }
  }, [saved]);

  const value = useMemo(() => {
    const savedUrls = new Set(saved.map((a) => a.url));

    const isSaved = (url) => savedUrls.has(url);

    const toggleSave = (article) => {
      if (!article || !article.url) return;
      setSaved((prev) =>
        prev.some((a) => a.url === article.url)
          ? prev.filter((a) => a.url !== article.url)
          : [{ ...article, savedAt: Date.now() }, ...prev]
      );
    };

    const removeSaved = (url) =>
      setSaved((prev) => prev.filter((a) => a.url !== url));

    return { saved, isSaved, toggleSave, removeSaved };
  }, [saved]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  return useContext(LibraryContext);
}
