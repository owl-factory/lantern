import React from "react";

/**
 * Renders a small swatch for displaying a color, usable as a key or reference
 * @param color The color to render within the Swatch
 */
export function Swatch({ color }: { color: string }): JSX.Element {
  const style = {
    display: "inline-block",
    marginLeft: "10px",
    marginRight: "5px",
    marginTop: "5px",

    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "black",

    width: "12px",
    height: "12px",

    backgroundColor: color,
  };
  return <div style={style}/>;
}
