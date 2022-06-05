import React from "react";
import { ColumnElement } from "types/layouts/columnElement";
import { SheetElement } from "../SheetElement";
import style from "../styling/Column.module.scss";

interface SheetColumnProps {
  element: ColumnElement;
}

/**
 * Renders a checkbox input element
 * @param element The checkbox element description
 */
export function SheetColumn(props: SheetColumnProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={Math.random()} element={childElement}/>);
  }
  return (
    <div className={`${style.column}`} style={{flexGrow: props.element.weight}}>
      {elements}
    </div>
  );
}
