import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'rose-gold',
    name: 'رزگلد',
    englishName: 'Rose Gold',
    emoji: '🌹',
    accentColor: '#e8a87c',
    bgPrimary: '#faf6f0',
    feel: 'گرم، آرام‌بخش، کلاسیک',
  },
  {
    id: 'lavender',
    name: 'اسطوخودوس',
    englishName: 'Lavender',
    emoji: '💜',
    accentColor: '#b8a0d4',
    bgPrimary: '#f5f0fa',
    feel: 'آرام‌بخش، رویایی، زنانه',
  },
  {
    id: 'mint',
    name: 'نعنایی',
    englishName: 'Mint & Gold',
    emoji: '🌿',
    accentColor: '#7bc4a8',
    bgPrimary: '#f4faf7',
    feel: 'تازه، طبیعی، لوکس',
  },
  {
    id: 'sunset',
    name: 'صورتی غروب',
    englishName: 'Sunset Pink',
    emoji: '🌅',
    accentColor: '#ff7b89',
    bgPrimary: '#fff5f5',
    feel: 'پرانرژی، شاد، مدرن',
  },
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('luxury_jewel_theme');
    if (saved && THEMES.some(t => t.id === saved)) {
      return saved;
    }
    return 'rose-gold';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('luxury_jewel_theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeId) => {
    if (THEMES.some(t => t.id === themeId)) {
      setCurrentTheme(themeId);
    }
  };

  const activeThemeObject = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, activeThemeObject, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
