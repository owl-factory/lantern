import React from "react";

/**
 * Renders a standarized table header cell element
 * @param props.children The contents of the table header cell
 */
export function TableHeader(props: { children: React.ReactNode }) {
  return (
    <th>
      {props.children}
    </th>
  );
}
