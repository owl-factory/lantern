import React from "react";
import { RowElementDescriptor } from "types/sheetElementDescriptors";
import { SheetElement } from "../SheetElement";
import style from "../styling/Row.module.scss";
import { SheetElementProps } from "../types";

/**
 * Renders a row element
 * @param element The row element description
 */
export function SheetRow(props: SheetElementProps<RowElementDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={Math.random()} {...props} element={childElement}/>);
  }
  return (
    <div className={`${style.row}`} style={{}}>
      {elements}
    </div>
  );
}
