import React from "react";
import { TableCellDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElement } from "../SheetElement";
import { SheetElementProps } from "../../types";

/**
 * Renders an table cell element
 * @param element The table cell element description
 */
export function SheetTableCell(props: SheetElementProps<TableCellDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>);
  }
  return (
    <td colSpan={props.element.width}>
      {elements}
    </td>
  );
}
