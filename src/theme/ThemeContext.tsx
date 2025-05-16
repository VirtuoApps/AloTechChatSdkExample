import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import type { ThemeColors } from './theme';
import { lightTheme, darkTheme } from './theme';

interface ThemeContextType {
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark';
}> = ({ children, initialTheme }) => {
  const deviceColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(
    initialTheme ? initialTheme === 'dark' : deviceColorScheme === 'dark'
  );

  // Update theme based on device settings (only if initialTheme is not provided)
  useEffect(() => {
    if (!initialTheme) {
      setIsDark(deviceColorScheme === 'dark');
    }
  }, [deviceColorScheme, initialTheme]);

  // Update theme when initialTheme prop changes
  useEffect(() => {
    if (initialTheme) {
      setIsDark(initialTheme === 'dark');
    }
  }, [initialTheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
