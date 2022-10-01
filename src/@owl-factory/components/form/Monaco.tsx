import React from "react";
import Editor from "@monaco-editor/react";
import { useField } from "formik";

/**
 * Renders a Monaco editor with Formik functionality
 * @param props The default Monaco editor props
 * @returns A Monaco editor with Formik enabled
 */
export function MonacoEditor(props: any) {
  const [ field ] = useField(props);

  return (<Editor
    {...props}
    {...field}
    onChange={(e) => field.onChange({ target: { name: field.name, value: e }})}
  />);
}
