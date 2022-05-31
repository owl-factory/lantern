import React from "react";
import { RowElement } from "types/layouts/rowElement";
import { SheetElement } from "../SheetElement";

interface SheetRowProps {
  element: RowElement;
}

export function SheetRow(props: SheetRowProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement element={childElement}/>);
  }
  return (
    <div style={{display: "flex"}}>
      {elements}
    </div>
  );
}
