import React from "react";
import { BackgroundElement } from "types/layouts/backgroundElement";
import { SheetElement } from "../SheetElement";

interface SheetBackgroundProps {
  element: BackgroundElement;
}

/**
 * Renders an image of the background
 * @param element The SheetBackground element description
 */
export function SheetBackground(props: SheetBackgroundProps) {
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
