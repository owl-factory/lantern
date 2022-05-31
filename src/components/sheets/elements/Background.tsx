import React from "react";
import { BackgroundElement } from "types/layouts/backgroundElement";
import { SheetElement } from "../SheetElement";

interface SheetBackgroundProps {
  element: BackgroundElement;
}

export function SheetBackground(props: SheetBackgroundProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement element={childElement}/>);
  }
  return (
    <div>
      {elements}
    </div>
  );
}
