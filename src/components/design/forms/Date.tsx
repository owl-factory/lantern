import React from "react";
import { Input, InputProps } from "./Input";

/**
 * An input set up for handling dates. Formats the Input function to work properly
 * @param props.aria-label The usability label
 * @param props.disabled If an input is disabled or not
 * @param props.name The name of the input
 * @param props.placeholder A placeholder value for when the input is empty
 * @param props.rows The number of rows (multiline must be true)
 * @param props.as Controls what the input is seen as
 * @param props.size The bootstrap size of the input. 
 */
export function Date(props: InputProps) {
  return <Input {...props} type="date"/>;
}