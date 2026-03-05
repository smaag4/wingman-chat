import { useState, useEffect, useLayoutEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';
import type { Theme, ThemeContextType } from './ThemeContext';
import { THEME_MODE, VALID_THEMES } from './ThemeContext';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem('app_theme');
    return VALID_THEMES.includes(stored as Theme) ? (stored as Theme) : 'system';
  });

  // Track real system preference
  const [systemPref, setSystemPref] = useState<boolean>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Listen for system preference changes
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPref(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Determine effective dark state
  const isDark = theme === 'system'
    ? systemPref
    : THEME_MODE[theme] === 'dark';

  // Apply the class, data-theme attribute, and persist explicit choices
  useLayoutEffect(() => {
    const html = document.documentElement;

    // Toggle dark class
    const currentlyDark = html.classList.contains('dark');
    if (currentlyDark !== isDark) {
      html.classList.toggle('dark', isDark);
    }

    // Set data-theme for themed variants, remove for original light/dark/system
    const themedVariants: Theme[] = ['frost', 'dawn', 'void', 'carbon'];
    if (themedVariants.includes(theme)) {
      html.setAttribute('data-theme', theme);
    } else {
      html.removeAttribute('data-theme');
    }

    // Persist
    if (theme === 'system') {
      localStorage.removeItem('app_theme');
    } else {
      localStorage.setItem('app_theme', theme);
    }
  }, [isDark, theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
