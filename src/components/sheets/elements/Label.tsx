import React from "react";
import { LabelElement } from "types/layouts/labelElement";

interface SheetLabelProps {
  element: LabelElement;
}

/**
 * Renders a label
 * @param element The label element description
 */
export function SheetLabel(props: SheetLabelProps) {
  return (
    <label htmlFor={props.element.for}>
      {props.element.text}
    </label>
  );
}
