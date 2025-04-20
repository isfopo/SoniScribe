import { useEffect, useState } from "react";
import theme from "./theme.json";

export type Theme = typeof theme;

export const useTheme = () => {
  const [prefersDarkMode, setPrefersDarkMode] = useState<boolean>(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const root = document.documentElement;
    const scheme = prefersDarkMode ? theme.schemes.dark : theme.schemes.light;

    // Set the CSS variables for the current theme
    Object.entries(scheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [prefersDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleColorScheme = () => {
    setPrefersDarkMode((prev) => !prev);
  };

  return {
    prefersDarkMode,
    toggleColorScheme,
    scheme: prefersDarkMode ? theme.schemes.dark : theme.schemes.light,
  };
};
