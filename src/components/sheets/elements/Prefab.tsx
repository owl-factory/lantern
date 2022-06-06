import React from "react";
import { PrefabElementDescriptor } from "types/sheetElementDescriptors";
import { SheetElement } from "../SheetElement";

interface SheetPrefabProps {
  element: PrefabElementDescriptor;
}

/**
 * Renders an image of the prefab
 * @param element The SheetPrefab element description
 */
export function SheetPrefab(props: SheetPrefabProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={Math.random()} element={childElement}/>);
  }
  console.log("Prefab");
  return (
    <div>
      {elements}
    </div>
  );
}
