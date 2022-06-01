import React from "react";
import { ColumnElement } from "types/layouts/columnElement";
import { SheetElement } from "../SheetElement";
import style from "../styling/Column.module.scss";

interface SheetColumnProps {
  element: ColumnElement;
}

export function SheetColumn(props: SheetColumnProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement element={childElement}/>);
  }
  return (
    <div className={`${style.column}`} style={{flexGrow: props.element.weight}}>
      {elements}
    </div>
  );
}
