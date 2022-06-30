import React, { ReactNode } from "react";

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

type ColumnSize = 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
const SIZES = ["xs", "sm", "md", "lg", "xl"];

/**
 * Converts a size and a prefix into a class, such as `col-sm-5`.
 * @param prefix The size prefix (xs, lg, etc)
 * @param size The size value. TODO - allow for half values here
 */
function sizeToClass(prefix: string, size?: ColumnSize) {
  if (!size) { return ""; }

  let className = "col-";
  if (prefix !== "xs") { className += `${prefix}-`; }
  className += size;

  return className;
}

interface ColProps {
  className?: string;
  children: ReactNode;
  xs?: WidthOptions;
  sm?: WidthOptions;
  md?: WidthOptions;
  lg?: WidthOptions;
  xl?: WidthOptions;
}

/**
 * Renders a col div from given size options
 * TODO - replace sizes with Jeet??
 * @param xs The size for the extra small screen size
 * @param sm The size for the small screen size
 * @param md The size for the medium screen size
 * @param lg The size for the large screen size
 * @param xl The size for the extra large screen size
 * @param className Any additional classes to render on top of the column
 * @param children Any child that is being placed within the div
 */
export function Col(props: ColProps) {
  let className = "";
  SIZES.forEach((size: string) => {
    className += `${sizeToClass(size, (props as any)[size])} ${props.className || ""}`;
  });
  return <div className={className}>{props.children}</div>;
}
