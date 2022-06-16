import React from "react";
import { PageElementDescriptor } from "types/sheetElementDescriptors";
import { SheetElement } from "../SheetElement";

interface SheetBackgroundProps {
  element: PageElementDescriptor;
}

/**
 * Renders an image of the background
 * @param element The SheetBackground element description
 */
export function SheetPage(props: SheetBackgroundProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={Math.random()} element={childElement}/>);
  }
  return (
    <div>
      {elements}
    </div>
  );
}