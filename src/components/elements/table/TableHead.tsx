import React from "react";
import { TableRow } from ".";

/**
 * Renders a standarized table head element
 * @param props.children The contents of the table head
 */
export function TableHead(props: { children: React.ReactNode }) {
  return (
    <thead>
      <TableRow>
        {props.children}
      </TableRow>
    </thead>
  );
}
