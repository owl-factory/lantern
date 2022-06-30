import { useField } from "formik";
import React from "react";
import { CheckboxElementDescriptor } from "types/sheetElementDescriptors";

interface SheetCheckboxProps {
  element: CheckboxElementDescriptor;
}

/**
 * Renders a checkbox input element
 * @param element The checkbox element description
 */
export function SheetCheckbox(props: SheetCheckboxProps) {
  // Makes Formik work right
  const [ field ] = useField(props.element);
  return (
    <input
      type="checkbox"
      {...field}
      value={props.element.value}
    />
  );
}
