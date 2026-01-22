
import React, { createContext, useContext, useState } from 'react';

export type ThemeMode = 'default' | 'contrast' | 'dyslexia' | 'tea';

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('default');
  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

export const themes = {
  default: { bg: '#ffffff', text: '#000000' },
  contrast: { bg: '#000000', text: '#ffffff' },
  dyslexia: { bg: '#fef6e4', text: '#001858' },
  tea: { bg: '#eef4ff', text: '#1b2a41' }
};
