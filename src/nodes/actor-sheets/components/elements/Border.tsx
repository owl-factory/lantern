import React from "react";
import { BorderDescriptor } from "nodes/actor-sheets/types/elements/border";
import style from "../../styles/Border.module.scss";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";

/**
 * Renders a border around given children
 * @param element The SheetBorder element description
 */
export function SheetBorder(props: SheetElementProps<BorderDescriptor>) {
  return (
    <div className={`${style.border}`}>
      <SheetChildren {...props}/>
    </div>
  );
}
