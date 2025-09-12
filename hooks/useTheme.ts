import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../types';

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === Theme.LIGHT || savedTheme === Theme.DARK) {
      return savedTheme;
    }
  }
  // Default to dark theme for new visitors.
  return Theme.DARK;
};

export const useTheme = () => {
  // Initialize state with the correct theme to prevent flickering.
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Effect to apply the theme to the DOM and persist it in localStorage.
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    root.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  }, []);

  return { theme, toggleTheme };
};
