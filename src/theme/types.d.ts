export interface Theme {
  description: string;
  seed: string;
  coreColors: CoreColors;
  extendedColors: never[];
  schemes: Schemes;
  palettes: Palettes;
}

export interface CoreColors {
  primary: string;
}

export interface Palettes {
  primary: { [key: string]: string };
  secondary: { [key: string]: string };
  tertiary: { [key: string]: string };
  neutral: { [key: string]: string };
  "neutral-variant": { [key: string]: string };
}

export interface Schemes {
  light: Scheme;
  "light-medium-contrast": Scheme;
  "light-high-contrast": Scheme;
  dark: Scheme;
  "dark-medium-contrast": Scheme;
  "dark-high-contrast": Scheme;
}

export interface Scheme {
  primary: string;
  surfaceTint: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  primaryFixed: string;
  onPrimaryFixed: string;
  primaryFixedDim: string;
  onPrimaryFixedVariant: string;
  secondaryFixed: string;
  onSecondaryFixed: string;
  secondaryFixedDim: string;
  onSecondaryFixedVariant: string;
  tertiaryFixed: string;
  onTertiaryFixed: string;
  tertiaryFixedDim: string;
  onTertiaryFixedVariant: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
}
