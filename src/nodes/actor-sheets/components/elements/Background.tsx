import React from "react";
import { BackgroundDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElement } from "../SheetElement";
import { SheetElementProps } from "../../types";

/**
 * Renders an image of the background
 * @param element The SheetBackground element description
 */
export function SheetBackground(props: SheetElementProps<BackgroundDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>);
  }
  return (
    <div>
      {elements}
    </div>
  );
}
