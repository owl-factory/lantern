
// The different width options available to rendering the width
// TODO - this should be expanded to 24 for maximum control
export type WidthOptions = 12 | 8 | 6 | 4 | 3 | 2 | 1;

// Defines an object width at different sizes. Leaving one blank will use the next
// available smallest size
export interface Width {
  xs?: WidthOptions;
  sm?: WidthOptions;
  md?: WidthOptions;
  lg?: WidthOptions;
  xl?: WidthOptions;
}
