import React from "react";
import { BorderDescriptor } from "nodes/actor-sheets/types/elements/border";
import { SheetElement } from "../SheetElement";
import style from "../../styles/Border.module.scss";
import { SheetElementProps } from "../../types";

/**
 * Renders a border around given children
 * @param element The SheetBorder element description
 */
export function SheetBorder(props: SheetElementProps<BorderDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>);
  }
  return (
    <div className={`${style.border}`}>
      {elements}
    </div>
  );
}
