import React from "react";
import { BorderElement } from "types/layouts/borderElement";
import { SheetElement } from "../SheetElement";
import style from "../styling/Border.module.scss";

interface SheetBorderProps {
  element: BorderElement;
}

/**
 * Renders a border around given children
 * @param element The SheetBorder element description
 */
export function SheetBorder(props: SheetBorderProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement element={childElement}/>);
  }
  return (
    <div className={`${style.border}`}>
      {elements}
    </div>
  );
}
