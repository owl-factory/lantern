import React from "react";
import { LabelElementDescriptor } from "types/sheetElementDescriptors";

interface SheetLabelProps {
  id: string;
  element: LabelElementDescriptor;
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
