import React from "react";
import { Input, InputProps } from "./Input";
import { def } from "../../../helpers/tools";

/**
 * An input set up for handling times. Formats the Input function to work properly
 * @param props see InputProps
 */
export function Time(props: InputProps) {

  return <Input {...props} type="time"/>;
}