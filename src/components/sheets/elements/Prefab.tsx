import React from "react";
import { PrefabElement } from "types/layouts/prefabElement";
import { SheetElement } from "../SheetElement";

interface SheetPrefabProps {
  element: PrefabElement;
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
