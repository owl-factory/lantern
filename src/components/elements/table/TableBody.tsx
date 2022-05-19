import React from "react";

/**
 * Renders a standarized wrapper for the table body (tbody) element
 * @param props.children The contents of the table body
 */
export function TableBody(props: { children: React.ReactNode }) {
  return (
    <tbody>
      {props.children}
    </tbody>
  );
}
