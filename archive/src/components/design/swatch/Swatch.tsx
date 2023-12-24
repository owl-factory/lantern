import React from "react";
import classes from "./Swatch.module.scss";

/**
 * Renders a small swatch for displaying a color, usable as a key or reference
 * @param color The color to render within the Swatch
 */
export function Swatch({ color }: { color: string }): JSX.Element {
  const style = {
    backgroundColor: color,
  };
  return <div className={classes.swatch} style={style}/>;
}
