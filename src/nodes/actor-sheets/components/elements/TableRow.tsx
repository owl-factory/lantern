import React from "react";
import { TableRowDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElement } from "../SheetElement";
import { SheetElementProps } from "../../types";

/**
 * Renders an table row element
 * @param element The table row element description
 */
export function SheetTableRow(props: SheetElementProps<TableRowDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>);
  }
  return (
    <tr >
      {elements}
    </tr>
  );
}
