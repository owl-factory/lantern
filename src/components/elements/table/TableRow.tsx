import React from "react";

/**
 * Renders a standarized table row element
 * @param props.children The contents of the table row
 */
export function TableRow(props: { children: React.ReactNode }) {
  return (
    <tr>
      {props.children}
    </tr>
  );
}
