import { useField } from "formik";
import React from "react";
import { RadioElementDescriptor } from "types/sheetElementDescriptors";

interface SheetRadioProps {
  element: RadioElementDescriptor;
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
