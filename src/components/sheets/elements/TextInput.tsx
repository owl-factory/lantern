import { useField } from "formik";
import React from "react";
import { TextInputElementDescriptor } from "types/sheetElementDescriptors";
import style from "../styling/Input.module.scss";

interface SheetTextInputProps {
  id: string;
  element: TextInputElementDescriptor;
}

/**
 * Renders a text input element
 * @param element The text input element description
 */
export function SheetTextInput(props: SheetTextInputProps) {
  // Makes Formik work right
  const [ field ] = useField(props.element);
  return (
    <div>
      <input
        type="text"
        className={`${style.actorSheetInput}`}
        {...field}
      />
    </div>
  );
}
