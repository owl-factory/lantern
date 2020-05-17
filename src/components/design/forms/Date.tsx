import React from "react";
import { Input, InputProps } from "./Input";

/**
 * An input set up for handling dates. Formats the Input function to work properly
 * @param props see IInput
 */
export function Date(props: InputProps) {
  return <Input {...props} type="date"/>;
}