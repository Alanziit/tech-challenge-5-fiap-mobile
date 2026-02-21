import React, { createContext, useContext, useState, ReactNode } from "react";

type Theme = {
  bg: string;
  text: string;
};

export const themes: Record<string, Theme> = {
  default: { bg: "#ffffff", text: "#000000" },
  contrast: { bg: "#000000", text: "#ffffff" },
  dyslexia: { bg: "#f5f5dc", text: "#1a1a1a" },
  tea: { bg: "#f0fff0", text: "#003300" },
};

interface IThemeContext {
  mode: string;
  setMode: (m: string) => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<string>("default");

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export default ThemeProvider;
