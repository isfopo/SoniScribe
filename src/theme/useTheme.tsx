import { useEffect, useState } from "react";
import theme from "./theme.json";

export type Theme = typeof theme;

/**
 * Custom hook to manage the theme of the application.
 * It provides a way to toggle between light and dark modes and injects the corresponding CSS variables into the document.
 * It also listens for changes in the user's system preference for dark mode and updates the theme accordingly.
 * @returns An object containing the current theme, a function to toggle the theme, and a boolean indicating if dark mode is preferred.
 */
export const useTheme = () => {
  const [prefersDarkMode, setPrefersDarkMode] = useState<boolean>(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Set the theme based on the user's preference
  useEffect(() => {
    const root = document.documentElement;
    const scheme = prefersDarkMode ? theme.schemes.dark : theme.schemes.light;

    // Set the CSS variables for the current theme
    Object.entries(scheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [prefersDarkMode]);

  // Listen for changes in the user's system preference for dark mode
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

  // Function to toggle the color scheme
  const toggleColorScheme = () => {
    setPrefersDarkMode((prev) => !prev);
  };

  return {
    /** true if the user has dark mode set */
    prefersDarkMode,
    /** Toggle he current theme */
    toggleColorScheme,
    /** The current theme based on user's preference */
    scheme: prefersDarkMode ? theme.schemes.dark : theme.schemes.light,
  };
};
