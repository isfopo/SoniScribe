import { useMemo } from "react";
import { type Theme, getTheme } from "../helpers/theme";

export const useTheme = (): Theme => {
  return useMemo<Theme>(() => getTheme(), []);
};
