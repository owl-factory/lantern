import React from "react";
import { BorderElement } from "types/layouts/borderElement";
import { SheetElement } from "../SheetElement";

interface SheetBorderProps {
  element: BorderElement;
}

export function SheetBorder(props: SheetBorderProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement element={childElement}/>);
  }
  return (
    <div style={{borderStyle: "solid", borderWidth: 1}}>
      {elements}
    </div>
  );
}
