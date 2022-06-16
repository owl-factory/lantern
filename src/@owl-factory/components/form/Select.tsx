import { useField } from "formik";
import React, { CSSProperties } from "react";

interface SelectProps {
  ariaLabel?: string;
  className?: string;
  children: React.ReactChild | React.ReactChildren | JSX.Element[];
  disabled?: boolean;
  id?: string;
  label?: string;
  name: string;
  onBlur?: (e: React.ChangeEvent<any>) => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  style?: CSSProperties;
}

/**
 * Creates a formik-ready Boostrap5-styled select box.
 * @param ariaLabel The readability label
 * @param className Any additional CSS classes to apply to the select
 * @param children The options to render for the select
 * @param disabled Boolean. True if the input should be disabled
 * @param id The id of the select input. Defaults to the name
 * @param label An optional label that gives the select a floating label
 * @param name The name of the select input. Required.
 * @param onBlur The action to run when this select input loses focus.
 * @param onChange The action to run when this select input is changed.
 * @param style Any custom styling to apply to this one element
 * @returns Returns a formik-ready select statement
 */
export function Select(props: SelectProps) {
  // Makes Formik work right
  const [ field ] = useField(props);
  const onBlur = props.onBlur ? props.onBlur : field.onBlur;

  const select = (
    <select
      aria-label={props.ariaLabel}
      className={`form-select ${props.className}`}
      disabled={props.disabled}
      id={props.id || props.name}
      style={props.style}
      {...field}
      onBlur={onBlur}
    >
      {props.children}
    </select>
  );

  if (!props.label) { return select; }
  return (
    <div className="form-floating">
      {select}
      <label htmlFor={props.id || props.name}>{props.label}</label>
    </div>
  );
}
