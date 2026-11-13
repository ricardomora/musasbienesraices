export type AppTheme = "light" | "dark";

export const APP_THEME_STORAGE_KEY = "musas.theme";

export function parseAppTheme(value: string | null | undefined): AppTheme | null {
  if (value === "light" || value === "dark") return value;
  return null;
}

export function applyThemeClass(theme: AppTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  root.dataset.theme = theme;
}
