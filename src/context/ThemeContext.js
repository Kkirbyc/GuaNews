import React, { createContext, useContext, useEffect, useState } from 'react';

export const THEME_STORAGE_KEY = 'guanews.theme.v2';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

function getInitialTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (err) {
    // localStorage unavailable — fall through to the default.
  }
  // Radium is the flagship look — default to dark unless the user picks light.
  return 'dark';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (err) {
      // Ignore storage errors so the toggle still works in-memory.
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
