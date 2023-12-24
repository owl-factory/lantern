import React from "react";

/**
 * Renders a standarized table element
 * @param props.children The contents of the table
 */
export function Table(props: { children: React.ReactNode }) {
  return (
    <table>
      {props.children}
    </table>
  );
}
