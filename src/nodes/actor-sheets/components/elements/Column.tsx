import React from "react";
import { ColumnDescriptor } from "nodes/actor-sheets/types/elements/column";
import { SheetElement } from "../SheetElement";
import style from "../../styles/Column.module.scss";
import { SheetElementProps } from "../../types";

/**
 * Renders a checkbox input element
 * @param element The checkbox element description
 */
export function SheetColumn(props: SheetElementProps<ColumnDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>);
  }
  return (
    <div className={`${style.column}`} style={{flexGrow: props.element.weight}}>
      {elements}
    </div>
  );
}
