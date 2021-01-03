import React from "react";
import { Select } from "./Forms";
import { SelectProps } from "./Select";

/**
 * A placeholder for a multiselect function that is more complex than the normal
 * multiselect from the select.
 * @param props.children Custom select options. TODO - should this be supported?
 * @param props.disabled Any non-empty string indicats this is disabled
 * @param props.emptyText Text to render on the empty select option, such as -- Select One --
 * @param props.includeEmpty Renders the empty select option at the top
 * @param props.labelKey The key to pull labels from within the option array
 * @param props.multiple If true, user may select multiple selects
 * @param props.name The field name of the select
 * @param props.options An array of structs containing the data to render out into options
 * @param props.size The size of the select input
 * @param props.valueKey The key to pull values from within the options array
 */
export function Multiselect(props: SelectProps): JSX.Element {
  return <Select {...props}/>;
}
