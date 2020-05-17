import React from "react";
import { FieldProps } from "./types";
import { BaseFormCheck, FormCheck } from "./FormCheck";

interface SharedRadioButtonProps extends FieldProps {
  ariaLabel?: string;
  checked?: any;
  disabled?: string;
  name: string;
  id: string;
  isValid?: boolean;
  onChange?: (event: any) => (void);
  value?: string;
}

interface BaseRadioButtonProps extends SharedRadioButtonProps {
  children?: any;
}

interface RadioButtonProps extends SharedRadioButtonProps {
  inline?: boolean;
  label?: string;
}

export function BaseRadioButton(props: BaseRadioButtonProps) {
  return (
    <BaseFormCheck type="radio" {...props}/>
  );
}

export function RadioButton(props: RadioButtonProps) {
  return (
    <FormCheck type="radio" {...props}/>
  );
}