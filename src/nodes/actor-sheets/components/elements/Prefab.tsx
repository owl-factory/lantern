import React from "react";
import { PrefabElementDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElement } from "../SheetElement";
import { SheetElementProps } from "../../types";

/**
 * Renders an image of the prefab
 * @param element The SheetPrefab element description
 */
export function SheetPrefab(props: SheetElementProps<PrefabElementDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={Math.random()} {...props} element={childElement}/>);
  }

  return (
    <div>
      {elements}
    </div>
  );
}
