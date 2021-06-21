import React from "react";

type ColumnSize = 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
const SIZES = ["xs", "sm", "md", "lg", "xl"];

function sizeToClass(prefix: string, size?: ColumnSize) {
  if (!size) { return ""; }

  let className = "col-";
  if (prefix != "xs") { className += `${prefix}-`; }
  className += size;

  return className;
}

export function Col(props: any) {
  let className = "";
  SIZES.forEach((size: string) => {
    className += `${sizeToClass(size, props[size])} `;
  });
  return <div className={className}>{props.children}</div>;
}