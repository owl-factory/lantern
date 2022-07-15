import React from "react";
import { ColumnElementDescriptor } from "types/sheetElementDescriptors/column";
import { SheetElement } from "../SheetElement";
import style from "../styling/Column.module.scss";
import { SheetElementProps } from "../types";

/**
 * Renders a checkbox input element
 * @param element The checkbox element description
 */
export function SheetColumn(props: SheetElementProps<ColumnElementDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={Math.random()} {...props} element={childElement}/>);
  }
  return (
    <div className={`${style.column}`} style={{flexGrow: props.element.weight}}>
      {elements}
    </div>
  );
}
