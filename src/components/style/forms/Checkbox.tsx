import { useField } from "formik";
import React from "react";

interface CheckboxProps {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
  name: string;
  type?: "checkbox" | "switch"
  value: string;
}

/**
 * Builds a formik-ready checkbox or switch with an optional label.
 * @param ariaLabel A readability label for the input
 * @param className Additional classes to apply to the checkbox
 * @param disabled True if the input should be disabled
 * @param id The id of the checkbox. Defaults to the value for name
 * @param label An optional label for the checkbox
 * @param name The name of the input. Required for Formik to work correctly
 * @param type Determines whether to render a checkbox or switch. Defaults to checkbox
 * @param value The desired value of the checkbox
 * @returns A checkbox element with an optional label
 */
export function Checkbox(props: CheckboxProps) {
  // Makes Formik work right
  const [ field ] = useField(props.name);

  const checkbox = (
    <input
      {...field}
      type="checkbox"
      aria-label={props.ariaLabel}
      className="form-check-input"
      id={props.id || props.name}
      value={props.value}
    />
  );

  const label = props.label ? (
    <label
      className="form-check-label"
      htmlFor={props.id || props.name}
    >{props.label}</label>
  ) : <></>;

  return (
    <div className={`form-check ${props.type === "switch" ? "form-switch" : ""} ${props.className}`}>
      {checkbox}
      {label}
    </div>
  );
}
