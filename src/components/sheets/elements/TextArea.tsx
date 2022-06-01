import { useField } from "formik";
import React from "react";
import { TextAreaElement } from "types/layouts/textAreaElement";
import style from "../styling/Input.module.scss";

interface SheetTextAreaProps {
  element: TextAreaElement;
}

export function SheetTextArea(props: SheetTextAreaProps) {
  const [ field ] = useField(props.element);
  return (
    <div>
      <textarea
        rows={4}
        className={`${style.actorSheetInput}`}
        {...field}
      />
    </div>
  );
}
