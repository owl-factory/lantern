import React from "react";
import { InlineElementDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElement } from "../SheetElement";
import { SheetElementProps } from "../../types";

/**
 * Renders an inline element that indicates that the contents will be rendered inline
 * @param element The inline element description
 */
export function SheetInline(props: SheetElementProps<InlineElementDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={Math.random()} {...props} element={childElement}/>);
  }
  return (
    <div >
      {elements}
    </div>
  );
}
