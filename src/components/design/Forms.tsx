/**
 * A standard design file for all form components. The aim is to make creating and designing forms
 * as easy, simple, and flexible as possible while providing a standardized view of the form
 *
 * @TODOS
 *  - Error handling for all inputs
 *  - Classes!
 *  - Accessibility options for all
 */

import {
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
import react from "react";
import { def } from "../../helpers/common";

interface IForm {
  children?: any; // The contents to place within the form
}

// TODO - put this in a types sheet (in models?)
type Size = (boolean | 2 | 1 | 12 | 6 | "auto" | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | undefined);

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

interface ICheckboxes extends ISharedGrid {
  label?: string; // The label of the checkbox group

  onChange?: (event: object) => (void); // The function to call on change

  data: object[]; // An array of objects containing the label, name, and default value of the checkboxes to render
  labelKey?: string; // The key of the label in data
  nameKey?: string; // The key of the name in data
  defaultValueKey?: string; // The key of the default value in data
  getValue?: (name: string) => (boolean); // A function that fetches the value of the checkbox
}

interface IInput extends ISharedGrid {
  id: string; // The input 'id' content
  name?: string; // The name of the input
  label?: string; // The label to display as

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
}

interface ISelect extends ISharedGrid {
  id: string; // The input 'id' content
  name?: string; // The name of the input
  label?: string; // The label to display
  disabled?: boolean; // If this is disabled or not
  required?: boolean; // If this is required or not

  defaultValue?: string; // The default value to use, if blank
  includeEmpty?: boolean; // Include an empty selection
  onChange?: (event: object) => void; // The function to use on change
  multiple?: boolean; // True allows for multiple items to be selected
  value?: any; // The default value to display

  data?: object[]; // An array of structs containing the label and value to use
  children?: any; // User-defined children, if that wants to be handled externally
  labelKey?: string; // The key to use for label inputs
  valueKey?: string; // The key of the value
}

type LabelPlacement = ("start" | "top" | "bottom" | "end" | undefined);

interface IRadioButtons extends ISharedGrid {
  id: string; // The input 'id' content
  name?: string; // The name of the input
  label?: string; // The label to display

  ariaLabel?: string; // Usability label
  defaultValue?: string; // The default value to use, if blank
  labelPlacement?: LabelPlacement; // The placement of the label
  onChange?: (event: object) => void; // The function to use on change
  value?: any; // The default value to display

  data?: object[]; // An array of structs containing the label and value to use
  children?: any; // User-defined children, if that wants to be handled externally
  labelKey?: string; // The key to use for label inputs
  valueKey?: string; // The key of the value
}

// TODO - classes for inputs

/**
 * Renders the outside of a form
 * @param props see IForm
 */
export function Form(props: IForm) {
  const children: JSX.Element[] = [];
  const [data, setData] = react.useState({});

  /**
   * Gets the value for a specific input
   * @param name The name of the field to pull data from
   */
  function getValue(name: string) {
    return (data as any)[name];
  }

  /**
   * The function to run when an input changes
   * @param event The change event that occurs on change
   */
  function onChange(event: any) {
    setFormData(event.target.name, event.target.value);
  }

  function onCheckboxChange(event: any) {
    setFormData(event.target.name, !getValue(event.target.name));
  }

  function registerValue(name: string, value: string | boolean | undefined, defaultValue: any = "" ) {
    if (getValue(name) !== undefined) {
      return;
    }

    const newValue = def<string | boolean>(value, defaultValue);

    setFormData(name, newValue);
  }

  /**
   * A general function to set form data
   * @param name The key to write the data to
   * @param value The value to write
   */
  function setFormData(name: string, value: string | boolean) {
    const newData: any = {...data};

    newData[name] = value;
    setData(newData);
  }

  // Clones and alters the children of this Form
  react.Children.toArray(props.children).forEach((child: any) => {
    const newChildName = def<string>(child.props.name, child.props.id);

    const newChildProps: any = {
      name: newChildName,
    };

    switch (child.type.name) {
      case "Checkboxes":
        const nameKey = def<string>(child.props.nameKey, "name");
        const defaultValueKey = def<string>(child.props.defaultValueKey, "defaultValue");
        const checkboxes = def<object[]>(child.props.data, []);

        checkboxes.forEach((item: any) => {
          registerValue(item[nameKey], item[defaultValueKey], false);
        });

        newChildProps["getValue"] = getValue;
        newChildProps["onChange"] = (event: any) => { onCheckboxChange(event); };
        break;

      case "Date":
      case "DateTime":
      case "Input":
      case "RadioButtons":
      case "Select":
      case "TextArea":
      case "Time":
        newChildProps["value"] = getValue(newChildName);
        newChildProps["onChange"] = (event: any) => { onChange(event); };

        break;
      // This is not a proper child of Form, so we can't update its props to have values it doesn't allow
      default:
        return;
    }

    const newChild = react.cloneElement(child, newChildProps);

    // Ensure this field exists in the data before render
    registerValue(newChildName, child.props.defaultValue);

    children.push(newChild);
  });

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
 * Renders a checkbox form group and a collection of checkboxes from the given checkbox
 * @param props see ICheckboxes
 */
export function Checkboxes(props: ICheckboxes) {
  const label = def<string>(props.label, "Checkbox");

  const data = def<object[]>(props.data, []);
  const labelKey = def<string>(props.labelKey, "label");
  const nameKey = def<string>(props.nameKey, "name");
  const getValue = def<(name: string) => (boolean | undefined)>(props.getValue, (name) => (false));

  const checkboxes: any = [];
  let index: number = 0;
  data.forEach((item: any) => {
    checkboxes.push(
      <FormControlLabel
        key={item[nameKey] + "_" + index++}
        control={
         <Checkbox checked={getValue(item[nameKey])} onChange={props.onChange} name={item[nameKey]}/>
        }
        label={item[labelKey]}
      />,
    );
  });

  return (
    <GridItem xs={props.xs} sm={props.sm} md={props.md} lg={props.lg} xl={props.xl}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{label}</FormLabel>
        <FormGroup>
          {checkboxes}
        </FormGroup>
      </FormControl>
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
  const name = def<string>(props.name, props.id);
  const label = def<string>(props.label, name);
  const disabled = def<boolean>(props.disabled, false);

  const helperTextID = props.id + "_helper";

  return (
    <Grid item sm={6} xs={12}>
      <FormControl>
        <InputLabel {...props.inputLabelProps} html-for={props.id}>{label}</InputLabel>
        <MuiInput
          id={props.id}
          name={name}

          aria-describedby={helperTextID}
          color={props.color}
          disabled={disabled}
          // TODO - error
          fullWidth={true}
          multiline={props.multiline}
          onChange={props.onChange}
          placeholder={props.placeholder}
          required={props.required}
          rows={props.rows}
          type={props.type}
          value={props.value}
        />
        <FormHelperText id={helperTextID}>{props.helperText}</FormHelperText>
      </FormControl>
    </Grid>
  );
}

/**
 * Renders a select element and its options
 * @param props see ISelect
 */
export function Select(props: ISelect) {
  const name = def<string>(props.name, props.id);
  const label = def<string>(props.label, name);
  const disabled = def<boolean>(props.disabled, false);
  const required = def<boolean>(props.required, false);

  const data = def<object[]>(props.data, []);
  const labelKey = def<string>(props.labelKey, "label");
  const valueKey = def<string>(props.valueKey, "value");

  let emptyElement: JSX.Element | undefined;
  if (props.includeEmpty !== false) {
    emptyElement = <MuiMenuItem value=""/>;
  }

  let children: any = [];
  if (props.children === undefined) {
    let index = 0;
    data.forEach((item: any) => {
      children.push(<MuiMenuItem key={props.id + "_" + index++} value={item[valueKey]}>{item[labelKey]}</MuiMenuItem>);
    });
  } else {
    children = props.children;
  }

  return (
    <GridItem xs={props.xs} sm={props.sm} md={props.md} lg={props.lg} xl={props.xl}>
      <FormControl>
        <InputLabel html-for={props.id}>{label}</InputLabel>
        <MuiSelect
          id={props.id}
          name={name}
          disabled={disabled}
          onChange={props.onChange}
          required={required}
          value={props.value}
        >
          {emptyElement}
          {children}
        </MuiSelect>
      </FormControl>
    </GridItem>
  );
}

/**
 * Renders a collection of radio buttons linked together. Operates in a very similar manner to Select
 * @param props see IRadioButtons
 */
export function RadioButtons(props: IRadioButtons) {
  const name = def<string>(props.name, props.id);
  const label = def<string>(props.label, name);
  const ariaLabel = def<string>(props.ariaLabel, label);

  const data = def<object[]>(props.data, []);
  const labelKey = def<string>(props.labelKey, "label");
  const valueKey = def<string>(props.valueKey, "value");

  let children: any = [];
  if (props.children === undefined) {
    let index: number = 0;
    data.forEach((item: any) => {
      children.push(
        <FormControlLabel
          key={props.id + "_" + index++}
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
    <GridItem xs={props.xs} sm={props.sm} md={props.md} lg={props.lg} xl={props.xl}>
      <FormControl>
        <FormLabel html-for={props.id}>{label}</FormLabel>
        <RadioGroup
          id={props.id}
          name={name}
          aria-label={ariaLabel}
          onChange={props.onChange}
          value={props.value}
        >
          {children}
        </RadioGroup>
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
