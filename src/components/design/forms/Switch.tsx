import React from "react";
import { FormCheck } from "./FormCheck";
import { FieldProps } from "./types";

interface SwitchProps extends FieldProps {
  ariaLabel?: string;
  children?: any;
  disabled?: string;
  name: string;
  isValid?: boolean;
}

/**
 * Renders the base Switch for higher customization
 * @param props See BaseSwitchProps
 */
export function Switch(props: SwitchProps) {
  return (
    <FormCheck type="switch" {...props}/>
  );
}