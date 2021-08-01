import React, { ReactNode } from "react";

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
  children: ReactNode;
  xs: ColumnSize;
  sm?: ColumnSize;
  md?: ColumnSize;
  lg?: ColumnSize;
  xl?: ColumnSize;
  onClick?: () => void;
}

/**
 * Renders a col div from given size options
 * @param xs The size for the extra small screen size
 * @param sm The size for the small screen size
 * @param md The size for the medium screen size
 * @param lg The size for the large screen size
 * @param xl The size for the extra large screen size
 * @param children Any child that is being placed within the div
 */
export function Col(props: ColProps) {
  let className = "";
  SIZES.forEach((size: string) => {
    className += `${sizeToClass(size, (props as any)[size])} `;
  });
  return <div className={className} {...props}>{props.children}</div>;
}