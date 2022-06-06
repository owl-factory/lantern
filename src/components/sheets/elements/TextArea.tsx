import { useField } from "formik";
import React from "react";
import { TextAreaElementDescriptor } from "types/sheetElementDescriptors";
import style from "../styling/Input.module.scss";

interface SheetTextAreaProps {
  element: TextAreaElementDescriptor;
}

/**
 * Renders a text area input element
 * @param element The text area element description
 */
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
