import React from "react";
import { InlineDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";

/**
 * Renders an inline element that indicates that the contents will be rendered inline
 * @param element The inline element description
 */
export function SheetInline(props: SheetElementProps<InlineDescriptor>) {
  return (
    <div style={{ display: "block" }}>
      <div style={{display: "flex"}}>
        <SheetChildren {...props} />
      </div>
    </div>
  );
}
