import React from "react";
import { FormCheck } from "./FormCheck";
import { CoreFormCheckProps } from "types/design/form";

/**
 * Renders the base checkbox for higher customization
 * @param props.aria-label The usability label
 * @param props.children Children to render within the input, such as labels
 * @param props.disabled Any non-empty string indicates that this field is disabled
 * @param props.name The field name of the input
 * @param props.id The optional id of this check element
 * @param props.xs Width for extra small screens
 * @param props.sm Width for small screens
 * @param props.md Width for extra medium screens
 * @param props.lg Width for large screens
 * @param props.xl Width for extra large screens
 */
export function Checkbox(props: CoreFormCheckProps): JSX.Element {
  return (
    <FormCheck type="checkbox" {...props}/>
  );
}
