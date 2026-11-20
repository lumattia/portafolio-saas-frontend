export const ICON_FILTER_LIGHT = 'brightness(0) invert(1)';
export const ICON_FILTER_DARK = 'none';

function hexToRgb(hex: string): [number, number, number] {
  let value = hex.replace('#', '');
  if (value.length === 3) {
    value = value.split('').map(c => c + c).join('');
  }
  const int = parseInt(value, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function parseColor(color: string): string | null {
  const trimmed = color.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) return trimmed;
  const rgb = trimmed.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (rgb) {
    return '#' + [rgb[1], rgb[2], rgb[3]]
      .map(n => Number(n).toString(16).padStart(2, '0'))
      .join('');
  }
  return null;
}

function channelLuminance(channel: number): number {
  const s = channel / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(color: string): number {
  const hex = parseColor(color);
  if (!hex) return 0;
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

export function contrastRatio(colorA: string, colorB: string): number {
  const l1 = relativeLuminance(colorA);
  const l2 = relativeLuminance(colorB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG contrast: returns whichever of the two candidates reads better on the background
export function bestOnColor(backgroundColor: string, lightColor: string, darkColor: string): string {
  return contrastRatio(backgroundColor, lightColor) >= contrastRatio(backgroundColor, darkColor)
    ? lightColor
    : darkColor;
}

interface OnColorVars {
  bg: string;
  icon: string;
  text: string;
}

const ON_COLOR_VARS: OnColorVars[] = [
  { bg: '--primary', icon: '--icon-on-primary', text: '--text-on-primary' },
  { bg: '--secondary', icon: '--icon-on-secondary', text: '--text-on-secondary' },
  { bg: '--error', icon: '--icon-on-danger', text: '--text-on-danger' },
  { bg: '--success', icon: '--icon-on-success', text: '--text-on-success' },
  { bg: '--warning', icon: '--icon-on-warning', text: '--text-on-warning' },
];

// Called when the theme loads: derives readable text + icon colors for every
// colored background, using WCAG contrast against --text-inverse / --text-primary.
export function syncOnColorVars(root: HTMLElement = document.documentElement): void {
  const styles = getComputedStyle(root);
  const light = styles.getPropertyValue('--text-inverse').trim() || '#ffffff';
  const dark = styles.getPropertyValue('--text-primary').trim() || '#1e1e1e';

  for (const { bg, icon, text } of ON_COLOR_VARS) {
    const background = styles.getPropertyValue(bg).trim();
    if (!background) continue;
    const onColor = bestOnColor(background, light, dark);
    root.style.setProperty(text, onColor);
    root.style.setProperty(icon, onColor === light ? ICON_FILTER_LIGHT : ICON_FILTER_DARK);
  }
}
