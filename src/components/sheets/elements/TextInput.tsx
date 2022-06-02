import { useField } from "formik";
import React from "react";
import { TextInputElement } from "types/layouts/textInputElement";
import style from "../styling/Input.module.scss";

interface SheetTextInputProps {
  element: TextInputElement;
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
