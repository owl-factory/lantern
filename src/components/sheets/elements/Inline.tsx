import React from "react";
import { InlineElement } from "types/layouts/inlineElement";
import { SheetElement } from "../SheetElement";

interface SheetInlineProps {
  element: InlineElement;
}

export function SheetInline(props: SheetInlineProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement element={childElement}/>);
  }
  return (
    <div >
      {elements}
    </div>
  );
}
