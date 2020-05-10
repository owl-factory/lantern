import React from "react";
import { Col } from "react-bootstrap";
import { FieldProps } from "./types";
import { def, objectKeepFields } from "../../../helpers/tools";
import { $gridItemPropFields, $renderMessage } from "./Forms";

type LabelPlacement = ("start" | "top" | "bottom" | "end" | undefined);

interface RadioButtonsProps extends FieldProps {
  name: string; // The name of the input
  label?: string; // The label to display
  keyPostfix?: string; // A postfix to append to the end of the key

  ariaLabel?: string; // Usability label
  defaultValue?: string; // The default value to use, if blank
  labelPlacement?: LabelPlacement; // The placement of the label
  onChange?: (event: any) => void; // The function to use on change
  value?: any; // The default value to display

  data?: object[]; // An array of structs containing the label and value to use
  children?: any; // User-defined children, if that wants to be handled externally
  labelKey?: string; // The key to use for label inputs
  valueKey?: string; // The key of the value

  getError?: (name: string) => (string); // Grabs errors for the given name
}

/**
 * Renders a collection of radio buttons linked together. Operates in a very similar manner to Select
 * @param props see IRadioButtons
 */
export function RadioButtons(props: RadioButtonsProps) {
  const id = def<string>(props.id, props.name);
  const label = def<string>(props.label, props.name);
  const keyPostfix = "_" + def<string>(props.keyPostfix, "");
  const ariaLabel = def<string>(props.ariaLabel, label);

  const data = def<object[]>(props.data, []);
  const labelKey = def<string>(props.labelKey, "label");
  const valueKey = def<string>(props.valueKey, "value");

  const radioGroupProps = objectKeepFields(props, ["name", "value"]);
  const gridItemProps = objectKeepFields(props, $gridItemPropFields);

  let children: any = [];
  if (props.children === undefined) {
    let index: number = 0;
    data.forEach((item: any) => {
      // children.push(
      //   <FormControlLabel
      //     key={id + "_" + index++ + keyPostfix}
      //     control={<Radio/>}
      //     label={item[labelKey]}
      //     labelPlacement={props.labelPlacement}
      //     value={item[valueKey]}
      //   />,
      // );
    });
  } else {
    children = props.children;
  }

  return (
    <Col {...gridItemProps}>
      <div /* error={$hasMessage(props.error)} */> { /* FormControl */}
        <label html-for={id}>{label}</label>
        <div
          {...radioGroupProps}
          id={id + keyPostfix}
          aria-label={ariaLabel}
          onChange={props.onChange}
        > { /* RadioGroup */}
          {children}
        </div>
        <div>{$renderMessage(props.message, props.error)}</div> { /* FormHelperText */}
      </div>
    </Col>
  );
}