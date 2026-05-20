import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../utils/storage";

const ThemeContext = createContext(null);
const STORAGE_KEY = "tba_theme";

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = storage.get(STORAGE_KEY);
    return stored || getSystemTheme();
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    storage.set(STORAGE_KEY, theme);
    document.documentElement.classList.add("theme-transition");
    const timeout = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      const stored = storage.get(STORAGE_KEY);
      if (!stored) {
        setTheme(event.matches ? "dark" : "light");
      }
    };
    matcher.addEventListener("change", handleChange);
    return () => matcher.removeEventListener("change", handleChange);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light"))
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// TODO: add a visual theme picker and preserve user preference in sync with system theme

