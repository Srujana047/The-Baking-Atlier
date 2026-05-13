import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../utils/storage";

const ThemeContext = createContext(null);

const STORAGE_KEY = "tba_theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => storage.get(STORAGE_KEY) || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    storage.set(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => {
    return {
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light"))
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// TODO: add system-preference detection + smooth theme transitions

