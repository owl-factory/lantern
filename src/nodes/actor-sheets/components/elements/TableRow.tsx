import React from "react";
import { TableRowDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";

/**
 * Renders an table row element
 * @param element The table row element description
 */
export function SheetTableRow(props: SheetElementProps<TableRowDescriptor>) {
  return (
    <tr >
      <SheetChildren {...props}/>
    </tr>
  );
}
