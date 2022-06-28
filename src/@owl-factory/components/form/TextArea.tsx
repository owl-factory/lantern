import { useField } from "formik";
import React from "react";
import { TextAreaElementDescriptor } from "types/sheetElementDescriptors";
import style from "../styling/Input.module.scss";

interface TextAreaProps {
  id?: string;
  name: string;
  rows?: number;
}

/**
 * Renders a text area input element
 * @param element The text area element description
 */
export function TextArea(props: TextAreaProps) {
  const [ field ] = useField(props);
  return (
    <div>
      <textarea
        style={{width: "100%"}}
        rows={props.rows || 4}
        {...field}
      />
    </div>
  );
}
