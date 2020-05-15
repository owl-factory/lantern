import React from "react";
import { BaseFormCheck, FormCheck } from "./FormCheck";
import { FieldProps } from "./types";

interface SharedSwitchProps extends FieldProps {
  ariaLabel?: string;
  disabled?: string;
  name: string;
  onChange?: (event: any) => (void);
  isValid?: boolean;
  checked?: any;
}

interface BaseSwitchProps extends SharedSwitchProps {
  children?: any;
}

interface SwitchProps extends SharedSwitchProps {
  inline?: boolean;
  label?: string;
}

/**
 * Renders a full Switch with labels and such
 * @param props See SwitchProps
 */
export function Switch(props: SwitchProps) {
  return (
    <FormCheck type="switch" {...props}/>
  );
}

/**
 * Renders the base Switch for higher customization
 * @param props See BaseSwitchProps
 */
export function BaseSwitch(props: BaseSwitchProps) {  
  return (
    <BaseFormCheck type="switch" {...props}/>
  );
}