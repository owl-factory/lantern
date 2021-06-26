import React from "react";

interface RowProps {
  children: React.ReactNode;
}

/**
 * Renders a row classed div
 * @param children The children inside of the row
 */
export function Row(props: RowProps): JSX.Element {
  return <div className="row">{props.children}</div>;
}