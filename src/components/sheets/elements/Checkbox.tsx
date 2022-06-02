import { useField } from "formik";
import React from "react";
import { CheckboxElement } from "types/layouts/checkboxElement";

interface SheetCheckboxProps {
  element: CheckboxElement;
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
