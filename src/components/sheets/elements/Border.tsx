import React from "react";
import { BorderElementDescriptor } from "types/sheetElementDescriptors/border";
import { SheetElement } from "../SheetElement";
import style from "../styling/Border.module.scss";
import { SheetElementProps } from "../types";

/**
 * Renders a border around given children
 * @param element The SheetBorder element description
 */
export function SheetBorder(props: SheetElementProps<BorderElementDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={Math.random()} {...props} element={childElement}/>);
  }
  return (
    <div className={`${style.border}`}>
      {elements}
    </div>
  );
}
