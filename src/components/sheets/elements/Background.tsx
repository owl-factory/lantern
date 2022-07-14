import React from "react";
import { BackgroundElementDescriptor } from "types/sheetElementDescriptors";
import { SheetElement } from "../SheetElement";

interface SheetBackgroundProps {
  id: string;
  element: BackgroundElementDescriptor;
}

/**
 * Renders an image of the background
 * @param element The SheetBackground element description
 */
export function SheetBackground(props: SheetBackgroundProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={Math.random()} id={props.id}  element={childElement}/>);
  }
  return (
    <div>
      {elements}
    </div>
  );
}
