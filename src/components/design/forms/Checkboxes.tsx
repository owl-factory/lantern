import React from "react";
import { Col } from "react-bootstrap";
import { FieldProps } from "./types";
import { $gridItemPropFields, $renderMessage } from "./Forms";
import { def, objectKeepFields } from "../../../helpers/tools";

type GetValue = (name: string, defaultValue: any) => (boolean | undefined);

interface CheckboxesProps extends FieldProps {
  keyPostfix?: string; // A postfix to append to the end of the id and key to prevent overlaps

  onChange?: (event: object) => (void); // The function to call on change

  data: object[]; // An array of objects containing the label, name, and default value of the checkboxes to render
  labelKey?: string; // The key of the label in data
  nameKey?: string; // The key of the name in data
  defaultValueKey?: string; // The key of the default value in data
  getValue?: (name: string, defaultValue: any) => (boolean); // A function that fetches the value of the checkbox
}

/**
 * Renders a checkbox form group and a collection of checkboxes from the given checkbox
 * @param props see ICheckboxes
 */
export function Checkboxes(props: CheckboxesProps) {
  const label = def<string>(props.label, "Checkbox");
  const keyPostfix = "_" + def<string>(props.keyPostfix, "");

  const data = def<object[]>(props.data, []);
  const labelKey = def<string>(props.labelKey, "label");
  const nameKey = def<string>(props.nameKey, "name");
  const getValue = def<GetValue>(props.getValue, (name, defaultValue) => (false));

  const checkboxes: any = [];
  let index: number = 0;

  const gridItemProps = objectKeepFields(props, $gridItemPropFields);

  data.forEach((item: any) => {
    checkboxes.push(
      // <div // FormControlLabel
      //   key={item[nameKey] + "_" + index++ + keyPostfix}
      //   control={
         <input type="checkbox" checked={getValue(item[nameKey], false)} onChange={props.onChange} name={item[nameKey]}/>
        // }
      //   label={item[labelKey]}
      // />,
    );
  });

  return (
    <Col {...gridItemProps}>
      <div  /* error={$hasMessage(props.error)} */> { /* FormControl */}
        <div >{label}</div> { /* FormLabel */}
        <div> { /* FormGroup */}
          {checkboxes}
        </div>
        <div>{$renderMessage(props.message, props.error)}</div> { /* FormHelperText */}
      </div>
    </Col>
  );
}