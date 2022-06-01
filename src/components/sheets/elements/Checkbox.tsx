import { useField } from "formik";
import React from "react";
import { CheckboxElement } from "types/layouts/checkboxElement";

interface SheetCheckboxProps {
  element: CheckboxElement;
}

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
