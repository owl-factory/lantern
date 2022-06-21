import React from "react";
import { InlineElementDescriptor } from "types/sheetElementDescriptors";
import { SheetElement } from "../SheetElement";

interface SheetInlineProps {
  id: string;
  element: InlineElementDescriptor;
}

/**
 * Renders an inline element that indicates that the contents will be rendered inline
 * @param element The inline element description
 */
export function SheetInline(props: SheetInlineProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={Math.random()} id={props.id} element={childElement}/>);
  }
  return (
    <div >
      {elements}
    </div>
  );
}
