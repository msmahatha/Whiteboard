// Excalidraw-inspired color palette
export const COLOR_PALETTE = [
  // Grayscale
  '#000000', // Black
  '#495057', // Dark Gray
  '#868e96', // Gray
  '#ced4da', // Light Gray
  '#ffffff', // White
  
  // Primary Colors
  '#e03131', // Red
  '#fd7e14', // Orange
  '#fab005', // Yellow
  '#40c057', // Green
  '#339af0', // Blue
  '#7950f2', // Purple
  '#f783ac', // Pink
  
  // Muted Colors
  '#c92a2a', // Dark Red
  '#fd7e14', // Dark Orange
  '#f59f00', // Dark Yellow
  '#37b24d', // Dark Green
  '#1971c2', // Dark Blue
  '#6741d9', // Dark Purple
  '#e64980', // Dark Pink
  
  // Pastel Colors
  '#ffe0e0', // Light Red
  '#fff4e0', // Light Orange
  '#fff9db', // Light Yellow
  '#e6fcf5', // Light Green
  '#e7f5ff', // Light Blue
  '#f3f0ff', // Light Purple
  '#fff0f6', // Light Pink
];

export const STROKE_COLORS = COLOR_PALETTE;

export const BACKGROUND_COLORS = [
  'transparent',
  ...COLOR_PALETTE.slice(7), // Exclude black and dark grays for backgrounds
];

export const STROKE_WIDTHS = {
  thin: 1,
  medium: 2,
  thick: 4,
  extraThick: 8,
} as const;

export const FONT_SIZES = {
  small: 16,
  medium: 20,
  large: 28,
  extraLarge: 36,
} as const;

export const FONT_FAMILIES = [
  { name: 'Virgil', label: 'Hand-drawn', value: 'Virgil, Segoe Print, Bradley Hand, Chilanka, TSCu_Comic, casual, cursive' },
  { name: 'Helvetica', label: 'Normal', value: 'Helvetica, Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
  { name: 'Cascadia', label: 'Code', value: 'Cascadia Code, Consolas, Monaco, Liberation Mono, Lucida Console, monospace' },
  { name: 'Inter', label: 'Modern', value: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' },
  { name: 'Poppins', label: 'Friendly', value: 'Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' },
  { name: 'Roboto', label: 'Clean', value: 'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' },
] as const;

export type StrokeWidth = keyof typeof STROKE_WIDTHS;
export type FontSize = keyof typeof FONT_SIZES;
export type FontFamily = typeof FONT_FAMILIES[number]['name'];
