export const THEME_COLORS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const;

export type ThemeColor = (typeof THEME_COLORS)[number];

export type Theme = Record<ThemeColor, string>;

export const getTheme = (): Theme => {
  const theme: Theme = {} as Theme;
  for (const color of THEME_COLORS) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(
      `--${color}`,
    );
    theme[color] = value;
  }
  return theme;
};
