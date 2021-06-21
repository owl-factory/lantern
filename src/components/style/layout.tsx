import React from "react";

interface ColProps {
  children: React.ReactNode;
  xs: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export function Col2(props: ColProps) {
  let classes = `col-${props.xs}`;
  if (props.sm) { classes += ` col-sm-${props.sm}`;}
  if (props.md) { classes += ` col-md-${props.md}`;}
  if (props.lg) { classes += ` col-lg-${props.lg}`;}
  if (props.xl) { classes += ` col-xl-${props.xl}`;}

  return <div className={classes}>{ props.children }</div>;
}

export function Row2(props: { children: React.ReactNode; }): JSX.Element {
  return <div className="row">{props.children}</div>;
}
