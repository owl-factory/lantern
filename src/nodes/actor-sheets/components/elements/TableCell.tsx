import React from "react";
import { TableCellDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";

/**
 * Renders an table cell element
 * @param element The table cell element description
 */
export function SheetTableCell(props: SheetElementProps<TableCellDescriptor>) {
  return (
    <td colSpan={props.element.width}>
      <SheetChildren {...props}/>
    </td>
  );
}
