import React from "react";
import { TableDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElement } from "../SheetElement";
import { SheetElementProps } from "../../types";

/**
 * Renders an table element
 * @param element The table element description
 */
export function SheetTable(props: SheetElementProps<TableDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>);
  }
  return (
    <table >
      <tbody>
        {elements}
      </tbody>
    </table>
  );
}
