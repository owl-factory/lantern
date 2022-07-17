import React from "react";
import { PageDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";

/**
 * Renders an image of the background
 * @param element The SheetBackground element description
 */
export function SheetPage(props: SheetElementProps<PageDescriptor>) {
  return (
    <div>
      <SheetChildren {...props} />
    </div>
  );
}
