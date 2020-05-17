/**
 * A standard design file for all form components. The aim is to make creating and designing forms
 * as easy, simple, and flexible as possible while providing a standardized view of the form
 *
 * @TODOS
 *  - Error handling for all inputs
 *  - Classes!
 *  - Accessibility options for all
 *  - External data and state
 *  - Buttons
 */

import {
  Button as MuiButton,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Input as MuiInput,
  InputLabel,
  MenuItem as MuiMenuItem,
  Radio,
  RadioGroup,
  Select as MuiSelect,
} from "@material-ui/core";
import React from "react";
import { deepCopy, deepGet, deepSet, def, defState, objectKeepFields, objectStripFields } from "../../helpers/tools";

interface IForm {
  id?: string; // The form id. Used for creating the postfix
  children?: any; // The contents to place within the form

  data?: object;
  setData?: React.Dispatch<React.SetStateAction<any>>;

  formState?: object;
  setFormState?: React.Dispatch<React.SetStateAction<any>>;

  errors?: object;

}

// TODO - put this in a types sheet (in models?)
type Size = (boolean | 2 | 1 | 12 | 6 | "auto" | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | undefined);
type ButtonVariant = ("contained" | "text" | "outlined" | undefined);

interface ISharedGrid {
  xs?: Size; // Width for extra small screens
  sm?: Size; // Width for small screens
  md?: Size; // Width for extra medium screens
  lg?: Size; // Width for large screens
  xl?: Size; // Width for extra large screens

  helperText?: string; // Accessibility text
}

interface IGridItem extends ISharedGrid {
  children?: any; // Children of the grid
}

interface IField extends ISharedGrid {
  id?: string; // The input id
  label?: string; // The label of the inputs

  error?: string;
  message?: string;
}

interface ICheckboxes extends IField {
  keyPostfix?: string; // A postfix to append to the end of the id and key to prevent overlaps

  onChange?: (event: object) => (void); // The function to call on change

  data: object[]; // An array of objects containing the label, name, and default value of the checkboxes to render
  labelKey?: string; // The key of the label in data
  nameKey?: string; // The key of the name in data
  defaultValueKey?: string; // The key of the default value in data
  getValue?: (name: string, defaultValue: any) => (boolean); // A function that fetches the value of the checkbox
}

interface ISection extends ISharedGrid {
  children?: any; // The children of the grid
}

interface IInput extends IField {
  name: string; // The name of the input
  keyPostfix?: string; // A postfix to append to the end of the key // TODO - do we need this?

  color?: "primary" | "secondary"; // The color of the input
  defaultValue?: string; // The default value to start with (if given no value)
  disabled?: boolean; // If an input is disabled or not
  inputLabelProps?: object; // Props to apply to the input label
  multiline?: boolean; // Allows for creating text areas
  onChange?: (event: object) => void; // The event that occurs on change
  placeholder?: string; // A placeholder value for when the input is empty
  required?: boolean; // If this is required or not
  rows?: number; // The number of rows (multiline must be true)
  type?: string; // The ???
  value?: string; // The value of the input

  getError?: (name: string) => (string); // Grabs errors for the given name
}

interface ISelect extends IField {
  name: string; // The name of the input
  disabled?: boolean; // If this is disabled or not
  required?: boolean; // If this is required or not
  keyPostfix?: string; // A postfix to append to the end of the key

  defaultValue?: string; // The default value to use, if blank
  includeEmpty?: boolean; // Include an empty selection
  onChange?: (event: object) => void; // The function to use on change
  multiple?: boolean; // True allows for multiple items to be selected
  value?: any; // The default value to display

  data?: object[]; // An array of structs containing the label and value to use
  children?: any; // User-defined children, if that wants to be handled externally
  labelKey?: string; // The key to use for label inputs
  valueKey?: string; // The key of the value

  getError?: (name: string) => (string); // Grabs errors for the given name
}

type LabelPlacement = ("start" | "top" | "bottom" | "end" | undefined);
type GetValue = (name: string, defaultValue: any) => (boolean | undefined);

interface IRadioButtons extends IField {
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

// TODO - classes for inputs

const $gridItemPropFields = ["xs", "sm", "md", "lg", "xl"];

/**
 * Grabs the default form state
 */
export function getDefaultFormState() {
  return {
    isDirty: false,
  };
}

/**
 * Determines if the error is a valid error
 *
 * @param error The error message
 */
function $hasMessage(error: string | undefined) {
  if (error === undefined || error === "") {
    return false;
  }
  return true;
}

/**
 * Renders a message given inputs, putting precedence on the error message
 *
 * @param message The message to display, if any
 * @param error The error to display, if any
 */
function $renderMessage(message: string | undefined, error: string | undefined) {
  if ($hasMessage(error)) {
    return error;
  } else if ($hasMessage(message)) {
    return message;
  }
}

/**
 * Renders the outside of a form
 * @param props see IForm
 */
export function Form(props: IForm) {
  const [formID, setFormID] = React.useState(def<string>(props.id, "form"));
  const [data, setData] = defState<any>(props.data, props.setData, {});
  const [formState, setFormState] = defState<any>(props.formState, props.setFormState, getDefaultFormState());

  let children: JSX.Element[] = [];
  let childIndex: number = 0;

  /**
   * Gets the value for a specific input
   * @param name The name of the field to pull data from
   */
  function getValue(name: string, defaultValue: any = "") {
    // Ensures that all components are controlled even if they haven't been registered
    const result = deepGet(data, name);
    if (result === undefined) {
      return defaultValue;
    }

    return result;
  }

  /**
   * The function to run when an input changes
   * @param event The change event that occurs on change
   */
  function onChange(event: any) {
    setFormData(event.target.name, event.target.value);
  }

  /**
   * Toggles event target value
   * @param event The input onChange event
   */
  function onCheckboxChange(event: any) {
    setFormData(event.target.name, !getValue(event.target.name));
  }

  /**
   * Ensures that an input has the appropriate allocation in data
   * @param name The key to save the value under
   * @param value The value to save
   * @param defaultValue The default value to register if value is undefined
   */
  function registerValue(name: string, value: string | boolean | undefined, defaultValue: any = "" ) {
    if (getValue(name) !== undefined) {
      return;
    }

    const newValue = def<string | boolean>(value, defaultValue);
    data[name] = newValue;
    setFormData(name, newValue, false);
  }

  /**
   * Renders out children and processes them to have the correct functionality
   * @param formChildren The children to process
   */
  function renderChildren(formChildren: any) {
    const renderedChildren: JSX.Element[] = [];
    React.Children.toArray(formChildren).forEach((child: any) => {
      const newChildName = def<string>(child.props.name, child.props.id);
      const keyPostfix: string = formID + "_" + childIndex++;
      const newChildProps: any = {};
      let newChild: any;

      switch (child.type.name) {
        case "Checkboxes":
          const nameKey = def<string>(child.props.nameKey, "name");
          const defaultValueKey = def<string>(child.props.defaultValueKey, "defaultValue");
          const checkboxes = def<object[]>(child.props.data, []);

          checkboxes.forEach((item: any) => {
            registerValue(item[nameKey], item[defaultValueKey], false);
          });

          newChildProps["name"] = newChildName;
          newChildProps["getValue"] = getValue;
          newChildProps["keyPostfix"] = keyPostfix;
          newChildProps["onChange"] = (event: any) => { onCheckboxChange(event); };
          newChild = React.cloneElement(child, newChildProps);
          registerValue(newChildName, child.props.defaultValue);
          break;

        case "Date":
        case "DateTime":
        case "Input":
        case "RadioButtons":
        case "Select":
        case "TextArea":
        case "Time":
          newChildProps["name"] = newChildName;
          newChildProps["keyPostfix"] = keyPostfix;
          newChildProps["value"] = getValue(newChildName);
          newChildProps["onChange"] = (event: any) => { onChange(event); };

          newChild = React.cloneElement(child, newChildProps);
          registerValue(newChildName, child.props.defaultValue);

          break;

        case "Section":
          newChildProps["children"] = renderChildren(child.props.children);
          newChild = React.cloneElement(child, newChildProps);
          break;

        // This is not a proper child of Form, so we can't update its props to have values it doesn't allow
        default:
          renderedChildren.push(child);
          return;
      }

      renderedChildren.push(newChild);
    });
    return renderedChildren;
  }

  /**
   * A general function to set form data
   * @param name The key to write the data to
   * @param value The value to write
   */
  function setFormData(name: string, value: string | boolean, doesDirty?: boolean) {
    const newData: any = deepCopy(data);

    if (doesDirty !== false && formState.dirty === false) {
      setFormState({...formState, dirty: true});
    }

    deepSet(newData, name, value);
    setData(newData);
  }

  // Clones and alters the children of this Form
  children = renderChildren(props.children);

  return (
    <form noValidate>
      <Grid container spacing={2}>
        {children}
      </Grid>
    </form>
  );
}

/**
 * Creates a standard wrapper for Grid Items
 * @param props see IGridItem
 */
function GridItem(props: IGridItem) {
  const xs = def<Size>(props.xs, 12);
  const sm = def<Size>(props.sm, 6);
  const md = def<Size>(props.md, sm);
  const lg = def<Size>(props.lg, md);
  const xl = def<Size>(props.xl, lg);

  return (
    <Grid item xl={xl} lg={lg} md={md} sm={sm} xs={xs}>
      {props.children}
    </Grid>
  );
}

/**
 * Renders a button and performs a given action
 * @param props see IButton
 */
export function Button(props: any) {
  const variant = def<ButtonVariant>(props.variant, "contained");
  const classes = undefined;

  const buttonProps = objectStripFields(props, ["ariaLabel", "classes", "onClick", "variant"]);

  return (
    <MuiButton
      {...buttonProps}
      aria-label={props.ariaLabel}
      classes={classes}
      onClick={(event) => {props.onClick(event, props.data, props.setData); }}
      variant={variant}
    >
      {props.children}
    </MuiButton>
  );
}

/**
 * Renders a checkbox form group and a collection of checkboxes from the given checkbox
 * @param props see ICheckboxes
 */
export function Checkboxes(props: ICheckboxes) {
  const label = def<string>(props.label, "Checkbox");
  const keyPostfix = "_" + def<string>(props.keyPostfix, "");

  const data = def<object[]>(props.data, []);
  const labelKey = def<string>(props.labelKey, "label");
  const nameKey = def<string>(props.nameKey, "name");
  const getValue = def<GetValue>(props.getValue, (name, defaultValue) => (false));

  const checkboxes: any = [];
  let index: number = 0;
  data.forEach((item: any) => {
    checkboxes.push(
      <FormControlLabel
        key={item[nameKey] + "_" + index++ + keyPostfix}
        control={
         <Checkbox checked={getValue(item[nameKey], false)} onChange={props.onChange} name={item[nameKey]}/>
        }
        label={item[labelKey]}
      />,
    );
  });

  return (
    <GridItem xs={props.xs} sm={props.sm} md={props.md} lg={props.lg} xl={props.xl}>
      <FormControl component="fieldset" error={$hasMessage(props.error)}>
        <FormLabel component="legend">{label}</FormLabel>
        <FormGroup>
          {checkboxes}
        </FormGroup>
        <FormHelperText>{$renderMessage(props.message, props.error)}</FormHelperText>
      </FormControl>
    </GridItem>
  );
}

/**
 * Allows us to render a new container grid for a new set of columns inside the existing Form
 * @param props see IContainer
 */
export function Section(props: ISection) {
  const gridItemProps = objectKeepFields(props, $gridItemPropFields);

  return (
    <GridItem {...gridItemProps}>
      <Grid container>
        {props.children}
      </Grid>
    </GridItem>
  );
}

/**
 * An input set up for handling dates. Formats the Input function to work properly
 * @param props see IInput
 */
export function Date(props: IInput) {
  const baseInputLabelProps = def<object>(props.inputLabelProps, {});
  const dateInputLabelProps = {...baseInputLabelProps, shrink: true};

  return <Input {...props} inputLabelProps={dateInputLabelProps} type="date"/>;
}

/**
 * An input set up for handling datetimes. Formats the Input function to work properly
 * @param props see IInput
 */
export function DateTime(props: IInput) {
  const baseInputLabelProps = def<object>(props.inputLabelProps, {});
  const dateInputLabelProps = {...baseInputLabelProps, shrink: true};

  return <Input {...props} inputLabelProps={dateInputLabelProps} type="datetime-local"/>;
}

/**
 * Renders out a grid-based input block
 * @param props see IInput
 */
export function Input(props: IInput) {
  const id = def<string>(props.id, props.name);
  const label = def<string>(props.label, props.name);
  const keyPostfix = "_" + def<string>(props.keyPostfix, "");
  const disabled = def<boolean>(props.disabled, false);

  const helperTextID = props.id + "_helper";
  const inputProps = objectKeepFields(
    props,
    ["color", "disabled", "multiline", "name", "placeholder", "required", "rows", "type", "value"],
  );
  const gridItemProps = objectKeepFields(props, $gridItemPropFields);

  return (
    <GridItem {...gridItemProps}>
      <FormControl error={$hasMessage(props.error)}>
        <InputLabel {...props.inputLabelProps} html-for={props.id}>{label}</InputLabel>
        <MuiInput
          {...inputProps}
          id={id}
          aria-describedby={helperTextID}
          fullWidth={true}
          onChange={props.onChange}
        />
        <FormHelperText id={helperTextID}>{$renderMessage(props.message, props.error)}</FormHelperText>
      </FormControl>
    </GridItem>
  );
}

/**
 * Renders a select element and its options
 * @param props see ISelect
 */
export function Select(props: ISelect) {
  const id = def<string>(props.id, props.name);
  const label = def<string>(props.label, props.name);
  const keyPostfix = "_" + def<string>(props.keyPostfix, "");

  const data = def<object[]>(props.data, []);
  const labelKey = def<string>(props.labelKey, "label");
  const valueKey = def<string>(props.valueKey, "value");

  const selectProps = objectKeepFields(props, ["disabled", "name", "required", "value"]);
  const gridItemProps = objectKeepFields(props, $gridItemPropFields);

  let emptyElement: JSX.Element | undefined;
  if (props.includeEmpty !== false) {
    emptyElement = <MuiMenuItem value="">&nbsp;</MuiMenuItem>;
  }

  let children: any = [];
  if (props.children === undefined) {
    let index = 0;
    data.forEach((item: any) => {
      children.push(
        <MuiMenuItem key={props.id + "_" + index++ + keyPostfix} value={item[valueKey]}>{item[labelKey]}</MuiMenuItem>,
      );
    });
  } else {
    children = props.children;
  }

  return (
    <GridItem {...gridItemProps}>
      <FormControl error={$hasMessage(props.error)}>
        <InputLabel html-for={props.id}>{label}</InputLabel>
        <MuiSelect
          {...selectProps}
          id={props.id + keyPostfix}
          onChange={props.onChange}
        >
          {emptyElement}
          {children}
        </MuiSelect>
        <FormHelperText>{$renderMessage(props.message, props.error)}</FormHelperText>
      </FormControl>
    </GridItem>
  );
}

/**
 * Renders a collection of radio buttons linked together. Operates in a very similar manner to Select
 * @param props see IRadioButtons
 */
export function RadioButtons(props: IRadioButtons) {
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
      children.push(
        <FormControlLabel
          key={id + "_" + index++ + keyPostfix}
          control={<Radio/>}
          label={item[labelKey]}
          labelPlacement={props.labelPlacement}
          value={item[valueKey]}
        />,
      );
    });
  } else {
    children = props.children;
  }

  return (
    <GridItem {...gridItemProps}>
      <FormControl error={$hasMessage(props.error)}>
        <FormLabel html-for={id}>{label}</FormLabel>
        <RadioGroup
          {...radioGroupProps}
          id={id + keyPostfix}
          aria-label={ariaLabel}
          onChange={props.onChange}
        >
          {children}
        </RadioGroup>
        <FormHelperText>{$renderMessage(props.message, props.error)}</FormHelperText>
      </FormControl>
    </GridItem>
  );
}

/**
 * An input set up for handling times. Formats the Input function to work properly
 * @param props see IInput
 */
export function TextArea(props: IInput) {
  const rows = def<number>(props.rows, 4);
  return <Input {...props} multiline rows={rows}/>;
}

/**
 * An input set up for handling times. Formats the Input function to work properly
 * @param props see IInput
 */
export function Time(props: IInput) {
  const baseInputLabelProps = def<object>(props.inputLabelProps, {});
  const dateInputLabelProps = {...baseInputLabelProps, shrink: true};

  return <Input {...props} inputLabelProps={dateInputLabelProps} type="time"/>;
}
