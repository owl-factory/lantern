import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Input as MuiInput,
  InputLabel,
  MenuItem as MuiMenuItem,
  Radio,
  RadioGroup,
  Select as MuiSelect,
} from "@material-ui/core";
import react, { Dispatch, SetStateAction } from "react";
import { def } from "../../helpers/common";

interface IForm {
  children?: any; // The contents to place within the form
}

type Size = (boolean | 2 | 1 | 12 | 6 | "auto" | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | undefined);

interface ISharedGrid {
  xs?: Size;
  sm?: Size;
  md?: Size;
  lg?: Size;
  xl?: Size;
}

interface IGridItem extends ISharedGrid {
  children?: any;
}

interface IInput extends ISharedGrid {
  id: string; // The input 'id' content
  name?: string; // The name of the input
  label?: string; // The label to display as
  color?: "primary" | "secondary"; // The color of the input
  defaultValue?: string; // The default value to start with (if given no value)
  disabled?: boolean; // If an input is disabled or not
  onChange?: (event: object) => void; // The event that occurs on change
  placeholder?: string; // A placeholder value for when the input is empty
  required?: boolean; // If this is required or not
  type?: string; // The ???
  value?: string; // The value of the input
  ariaDescribedBy?: string; // Readability setting
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

  /**
   * A general function to set form data
   * @param name The key to write the data to
   * @param value The value to write
   */
  function setFormData(name: string, value: string) {
    const newData: any = {...data};

    newData[name] = value;
    setData(newData);
  }

  // Clones and alters the children of this Form
  react.Children.toArray(props.children).forEach((child: any) => {
    const newChildName = def<string>(child.props.name, child.props.id);

    const newChild = react.cloneElement(child, {
      name: newChildName,
      onChange: (event: any) => { onChange(event); },
      value: getValue(newChildName),
    });

    // Ensure this field exists in the data before render
    if (getValue(newChildName) === undefined) {
      setFormData(newChildName, def<string>(child.props.defaultValue, ""));
    }

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
 * Renders out a grid-based input block
 * @param props see IInput
 */
export function Input(props: IInput) {
  const name = def<string>(props.name, props.id);
  const label = def<string>(props.label, name);
  const disabled = def<boolean>(props.disabled, false);

  return (
    <Grid item sm={6} xs={12}>
      <FormControl>
        <InputLabel html-for={props.id}>{label}</InputLabel>
        <MuiInput
          id={props.id}
          name={name}

          aria-describedby={props.ariaDescribedBy}
          color={props.color}
          disabled={disabled}
          // TODO - error
          onChange={props.onChange}
          fullWidth={true}
          placeholder={props.placeholder}
          required={props.required}
          type={props.type}
          value={props.value}
        />
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
    data.forEach((item: any) => {
      children.push(<MuiMenuItem value={item[valueKey]}>{item[labelKey]}</MuiMenuItem>);
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

export function Checkboxes(props: any) {
  const name = def<string>(props.name, props.id);
  const label = def<string>(props.label, name);

  const checkboxes: any = [];

  return (
    <GridItem xs={props.xs} sm={props.sm} md={props.md} lg={props.lg} xl={props.xl}>
      <FormControl component="fieldset">
        <FormLabel html-for={props.id}>{label}</FormLabel>
        {checkboxes}
      </FormControl>
    </GridItem>
  );
}

export function RadioButtons(props: any) {
  const name = def<string>(props.name, props.id);
  const label = def<string>(props.label, name);

  const data = def<object[]>(props.data, []);
  const labelKey = def<string>(props.labelKey, "label");
  const valueKey = def<string>(props.valueKey, "value");

  let children: any = [];
  if (props.children === undefined) {
    data.forEach((item: any) => {
    children.push(<FormControlLabel value={item[valueKey]} label={item[labelKey]} control={<Radio/>}/>);
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
          onChange={props.onChange}
          value={props.value}
        >
          {children}
        </RadioGroup>
      </FormControl>
    </GridItem>
  );
}
