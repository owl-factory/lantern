import React from "react";
import { PrefabDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";

/**
 * Renders an image of the prefab
 * @param element The SheetPrefab element description
 */
export function SheetPrefab(props: SheetElementProps<PrefabDescriptor>) {
  return (
    <div>
      <SheetChildren {...props}/>
    </div>
  );
}
