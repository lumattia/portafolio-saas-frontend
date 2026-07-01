export interface Color {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  textSecondaryColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface ThemeConfig {
  id: string;
  light: Color;
  dark: Color;
}
