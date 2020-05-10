import React from "react";
import { Input, InputProps } from "./Input";

/**
 * An input set up for handling datetimes. Formats the Input function to work properly
 * @param props see IInput
 */
export function DateTime(props: InputProps) {
  return <Input {...props} type="datetime-local"/>;
}