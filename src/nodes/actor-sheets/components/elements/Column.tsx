import React from "react";
import { ColumnDescriptor } from "nodes/actor-sheets/types/elements/column";
import style from "../../styles/Column.module.scss";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";

/**
 * Renders a checkbox input element
 * @param element The checkbox element description
 */
export function SheetColumn(props: SheetElementProps<ColumnDescriptor>) {
  return (
    <div className={`${style.column}`} style={{flexGrow: props.element.weight}}>
      <SheetChildren {...props}/>
    </div>
  );
}
