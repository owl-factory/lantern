import { useField } from "formik";
import React from "react";
import { TextInputElement } from "types/layouts/textInputElement";
import style from "../styling/Input.module.scss";

interface SheetTextInputProps {
  element: TextInputElement;
}

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
