import { createContext } from 'react';

// Support light, dark, system, and themed variants
export type Theme = 'light' | 'dark' | 'system' | 'frost' | 'dawn' | 'void' | 'carbon';

// Map each theme to its light/dark mode
export const THEME_MODE: Record<Exclude<Theme, 'system'>, 'light' | 'dark'> = {
  light: 'light',
  dark: 'dark',
  frost: 'light',
  dawn: 'light',
  void: 'dark',
  carbon: 'dark',
};

export const VALID_THEMES: Theme[] = ['light', 'dark', 'system', 'frost', 'dawn', 'void', 'carbon'];

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
