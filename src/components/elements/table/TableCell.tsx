import React from "react";

/**
 * Renders a standarized table cell element
 * @param props.children The contents of the table cell
 */
export function TableCell(props: { children: React.ReactNode }) {
  return (
    <td>
      {props.children}
    </td>
  );
}
