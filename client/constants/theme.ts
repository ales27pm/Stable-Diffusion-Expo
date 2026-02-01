import { Platform } from "react-native";

// Design Guidelines Colors
export const AppColors = {
  // Backgrounds (dark-dominant OLED optimized)
  backgroundPrimary: "#000000",
  backgroundSurface: "#1A1A1A",
  backgroundElevated: "#2A2A2A",

  // Accent colors
  primary: "#00F0FF", // Electric cyan
  secondary: "#FF00F5", // Vivid magenta

  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0A0",
  textTertiary: "#606060",

  // Semantic colors
  success: "#00FF88",
  error: "#FF3366",
  warning: "#FFB800",
};

const tintColorLight = AppColors.primary;
const tintColorDark = AppColors.primary;

export const Colors = {
  light: {
    text: AppColors.textPrimary,
    buttonText: "#000000",
    tabIconDefault: AppColors.textTertiary,
    tabIconSelected: tintColorLight,
    link: AppColors.primary,
    backgroundRoot: AppColors.backgroundPrimary,
    backgroundDefault: AppColors.backgroundSurface,
    backgroundSecondary: AppColors.backgroundElevated,
    backgroundTertiary: "#3A3A3A",
  },
  dark: {
    text: AppColors.textPrimary,
    buttonText: "#000000",
    tabIconDefault: AppColors.textTertiary,
    tabIconSelected: tintColorDark,
    link: AppColors.primary,
    backgroundRoot: AppColors.backgroundPrimary,
    backgroundDefault: AppColors.backgroundSurface,
    backgroundSecondary: AppColors.backgroundElevated,
    backgroundTertiary: "#3A3A3A",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  headline: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  button: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Shadows = {
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 8,
  },
  subtle: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 4,
  },
};
