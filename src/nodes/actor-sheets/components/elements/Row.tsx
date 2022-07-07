import React from "react";
import { RowDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElement } from "../SheetElement";
import style from "../../styles/Row.module.scss";
import { SheetElementProps } from "../../types";

/**
 * Renders a row element
 * @param element The row element description
 */
export function SheetRow(props: SheetElementProps<RowDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>);
  }
  return (
    <div className={`${style.row}`} style={{}}>
      {elements}
    </div>
  );
}
