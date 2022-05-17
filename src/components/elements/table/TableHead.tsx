import React from "react";
import { TableRow } from ".";

export function TableHead(props: any) {
  return (
    <thead>
      <TableRow>
        {props.children}
      </TableRow>
    </thead>
  );
}
