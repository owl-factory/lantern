import React from "react";
import { Input, InputProps } from "./Input";
import { def } from "../../../helpers/tools";

/**
 * An input set up for handling times. Formats the Input function to work properly
 * @param props see InputProps
 */
export function TextArea(props: InputProps) {
  const rows = def<number>(props.rows, 4);
  return <Input {...props} as="textarea" rows={rows}/>;
}