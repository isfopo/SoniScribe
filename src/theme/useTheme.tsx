import theme from "./theme.json";
import { Theme } from "./types";

export interface UseThemeOptions {
  /**
   * The theme to use.
   * @default "light"
   */
  theme?: "light" | "dark";
  /**
   * The color scheme to use.
   * @default "default"
   */
  scheme?: "default" | "highContrast" | "mediumContrast";
}

export const useTheme = ({ scheme }: UseThemeOptions): Theme => {
  return theme;
};
