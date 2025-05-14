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

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(deviceColorScheme === 'dark');

  // Update theme based on device settings
  useEffect(() => {
    setIsDark(deviceColorScheme === 'dark');
  }, [deviceColorScheme]);

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
