import { useField } from "formik";
import React from "react";
import { RadioElement } from "types/layouts/radioElement";

interface SheetRadioProps {
  element: RadioElement;
}

/**
 * Renders a radio input element
 * @param element The radio element description
 */
export function SheetRadio(props: SheetRadioProps) {
  // Makes Formik work right
  const [ field ] = useField(props.element);
  return (
    <input
      type="radio"
      {...field}
      value={props.element.value}
    />
  );
}
