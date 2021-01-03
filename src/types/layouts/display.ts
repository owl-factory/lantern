
// The different kind of display values used for changing if and how something renders
export type DisplayValues = "none" | "inline" | "inline-block" | "block" | "table" | "table-cell" | "table-row" | "flex" | "inline-flex";

// The struct that changes how and if something renders at a certain screen size
export interface Display {
  xs?: DisplayValues;
  sm?: DisplayValues;
  md?: DisplayValues;
  lg?: DisplayValues;
  xl?: DisplayValues;
}
