
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
type ThemeColor = 'green' | 'blue' | 'purple' | 'pink' | 'orange' | 'yellow' | 'gray' | 'peach';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => null,
  themeColor: 'green',
  setThemeColor: () => null,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    // Check prefers-color-scheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    const storedColor = localStorage.getItem('themeColor') as ThemeColor;
    return storedColor || 'green';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    localStorage.setItem('themeColor', color);
    
    // Apply CSS variables for the selected color
    const root = document.documentElement;
    const colors = {
      green: { hue: '142', saturation: '72%', lightness: '43%' },
      blue: { hue: '210', saturation: '70%', lightness: '50%' },
      purple: { hue: '270', saturation: '60%', lightness: '60%' },
      pink: { hue: '330', saturation: '65%', lightness: '65%' },
      orange: { hue: '30', saturation: '90%', lightness: '60%' },
      yellow: { hue: '45', saturation: '95%', lightness: '60%' },
      gray: { hue: '210', saturation: '10%', lightness: '50%' },
      peach: { hue: '15', saturation: '80%', lightness: '70%' }
    };
    
    if (colors[color]) {
      const { hue, saturation, lightness } = colors[color];
      root.style.setProperty('--primary-hue', hue);
      root.style.setProperty('--primary-saturation', saturation);
      root.style.setProperty('--primary-lightness', lightness);
    }
  };

  useEffect(() => {
    // Apply the theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    // Initialize theme color
    setThemeColor(themeColor);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};